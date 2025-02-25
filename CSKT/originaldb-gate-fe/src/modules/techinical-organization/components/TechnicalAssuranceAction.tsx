/* eslint-disable no-case-declarations */
import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Button, Flex, Form, Skeleton, Space } from "antd";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { useEffect, useState } from "react";
import { useMessage } from "@app/contexts/MessageContext";
import { listToTree, selectMap } from "@app/core/helper";
import ItemComponent from "../../../components/ItemsComponent";
import { getWard } from "@app/modules/it-categories/store/Ward.action";
import { ITechnicalAssuranceActionSelect } from "../interfaces/TechnicalAssurance.interface";
import { createTechnicalOrganizations, getOrganizationTree, getTechnicalOrganizationList, updateTechnicalOrganizations } from "../stores/TechnicalOrganization.action";
import { getTechnicalTypeTree } from "../stores/TechnicalType.action";
import { ActorRole, LEVEL_SCOPE_OPTIONS, OFFICAL_OPTIONS } from "../constants/level.constant";
import { getMajorList } from "@app/modules/force-categories/store/MajorCategories.action";
import { LevelCategoriesScope, ModalType } from "../enum/LevelCategory.enum";
import { arrayToTree } from "performant-array-to-tree";
import { createTechnicalTypes, updateTechnicalTypes } from "../stores/TechnicalTypes.action";
import { globalStore } from "@app/store/global.store";
import { userStore } from "@app/store/user/user.store";
import { Organizations } from "@app/types/types";
import { Action } from "@app/enums";
type TechnicalAssuranceActionType = {
    modalType: ModalType;
    type_id?: string;
    detail?: any;
    action: string
};

const TechnicalAssuranceAction: React.FC<TechnicalAssuranceActionType> = ({ modalType, type_id, detail, action }) => {
    const [form] = Form.useForm();
    const loading = useLoading();
    const modal = useModal();
    const { availableRoles } = globalStore();
    const { userInfo } = userStore();
    const { openMessage } = useMessage();
    const [types, setTypes] = useState<any[]>([])
    const [dataSelection, setDataSelection] = useState<ITechnicalAssuranceActionSelect>({
        organizations: [],
        wards: [],
        type: [],
        majors: [],
        technical_orgs: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const hanldeFinish = () => {
        form.submit();
    }
    const onFinish = async () => {
        try {
            const value = form.getFieldsValue();
            const ward_id = value?.ward_id?.ward || null;
            if (!ward_id) {
                form.setFields([
                    {
                        name: 'ward_id',
                        errors: ['Thông tin không được để trống!'],
                    },
                ]);
                return;
            }
            loading.show();
            if (action === Action.Create) {
                let technical_id: any = value?.technical_id || null;
                if (!technical_id) {
                    const technicalOrgPayload: any = {
                        name: value?.name,
                        code: value?.code,
                        address: value?.address,
                        description: value?.description,
                        is_offical: value?.is_offical,
                        org_manage_id: value?.org_manage_id,
                        ward_id,
                    };
                    const res = await createTechnicalOrganizations(technicalOrgPayload);
                    technical_id = res.id;
                }
                const technicalTypePayload: any = {
                    technical_id,
                    type_id: value?.type_id,
                    level: value?.level,
                    major_id: value?.major_id,
                    dvt: value?.dvt,
                    transport: value?.transport,
                    note: value?.note,
                };
                await createTechnicalTypes(technicalTypePayload);
                openMessage({
                    type: "success",
                    content: `Thêm mới thành công`,
                });
            } else {
                const technical_id = {
                    org_manage_id: value?.org_manage_id?.value ? value?.org_manage_id?.value : value?.org_manage_id,
                    code: value?.code,
                    address: value?.address,
                    description: value?.description,
                    name: value?.name,
                    is_offical: value?.is_offical,
                    ward_id: ward_id,
                    tbvt_categories: detail?.tbvt_categories,
                    personal_identifies: detail?.personal_identifies,
                }
                const payload = {
                    type_id: value?.type_id?.value ? value?.type_id?.value : value?.type_id,
                    major_id: value?.major_id?.value ? value?.major_id?.value : value?.major_id,
                    level: value?.level,
                    dvt: value?.dvt,
                    transport: value?.transport,
                    note: value?.note,
                }
                await Promise.all([
                    updateTechnicalTypes(detail?.id, payload),
                    updateTechnicalOrganizations(detail.technical_id?.id, technical_id)
                ])
            }


            form.resetFields();
            handleSuccess();
        } catch (error: any) {
            console.error(error);
            openMessage({
                type: "error",
                content: error?.message || "Lỗi hệ thống",
            });
        } finally {
            loading.hide();
        }
    };

    const handleSuccess = () => {
        loading.hide()
        modal.closeModal({ success: true })
    }
    const fetchData = async () => {
        try {
            let filter: any = {};
            if (availableRoles?.[0]?.role_id?.name === ActorRole.CSKT_K1) {
                filter = {
                    _or: [
                        {
                            _and: [
                                { code: { _contains: '43' } },
                                { is_enable: true }
                            ]
                        },
                        {
                            _and: [
                                { code: { _contains: '70' } },
                                { is_enable: true }
                            ]
                        }
                    ]
                };
            } else if (availableRoles?.[0]?.role_id?.name === ActorRole.CSKT_DV) {
                const org: Organizations | undefined = userInfo?.personal_id?.org_id;
                filter = {
                    _and: [
                        {
                            tree_path: {
                                _contains: org?.parent_id?.tree_path || org?.tree_path
                            }
                        },
                        {
                            is_enable: true
                        }
                    ]
                };
            }
            setIsLoading(true);
            const [organizations, wards, types, majors, technicalOrgs] = await Promise.all([
                getOrganizationTree({ ...filter }),
                getWard({}, {}),
                getTechnicalTypeTree({}, {}),
                getMajorList({}, {}),
                getTechnicalOrganizationList({ limit: -1 }, {})
            ]);

            setTypes(types)
            setDataSelection({
                organizations: listToTree(organizations),
                wards,
                type: arrayToTree([...types], { dataField: null }),
                majors: arrayToTree([...majors], { dataField: null }),
                technical_orgs: technicalOrgs
            });
        } catch (error: any) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const dataInput = [
        {
            title: `Tên ${{
                [ModalType.CSBD]: 'cơ sở kỹ thuật',
                [ModalType.ToBD]: 'tổ BĐKTcđ',
            }[modalType] || 'trạm CQĐT'
                }`,
            content: detail?.name ?? null,
            require: true,
            dataIndex: "name",
            rules: [
                { required: true, message: `Thông tin không được để trống!` },
            ],
        },
        {
            title: "Ký hiệu",
            content: detail?.code ?? null,
            require: false,
            dataIndex: "code",
        },
        {
            title: "Loại hình cơ sở kỹ thuật",
            content: detail?.type_id ?? (type_id || null),
            require: false,
            dataIndex: "type_id",
            rules: [
                { required: true, message: `Thông tin không được để trống!` },
            ],
        },
        {
            title: "Phân cấp",
            content: detail?.level ?? LevelCategoriesScope.CHIEN_THUAT,
            require: false,
            dataIndex: "level", rules: [
                { required: true, message: `Thông tin không được để trống!` },
            ],
        },
        {
            title: "Đơn vị quản lý",
            content: detail?.org_manage_id ?? null,
            require: false,
            dataIndex: "org_manage_id", rules: [
                { required: true, message: `Thông tin không được để trống!` },
            ],
        },
        {
            title: "Chuyên ngành",
            content: detail?.major_id ?? null,
            require: false,
            dataIndex: "major_id",
            rules: [
                { required: true, message: `Thông tin không được để trống!` },
            ],
        },
        {
            title: "Địa giới hành chính",
            content: detail?.ward_id ?? null,
            require: true,
            dataIndex: "ward_id",
            rules: [
                { required: true, message: `Thông tin không được để trống!` },
            ],
        },
        {
            title: "Số nhà, tên đường",
            content: detail?.address ?? null,
            require: false,
            dataIndex: "address",
        },
        {
            title: "Hình thức",
            content: detail?.is_offical ?? null,
            require: true,
            dataIndex: "is_offical",
            rules: [
                { required: true, message: `Thông tin không được để trống!` },
            ],
        },
        {
            title: "Đơn vị tính",
            content: detail?.dvt ?? null,
            require: false,
            dataIndex: "dvt",
        },
        {
            title: "Phương tiện cơ động",
            content: detail?.transport ?? null,
            require: false,
            dataIndex: "transport",
        },
        {
            title: "Ghi chú",
            content: detail?.note ?? null,
            require: false,
            dataIndex: "note",
        },
        {
            title: "",
            content: detail?.technical_id ?? null,
            require: false,
            hidden: true,
            dataIndex: "technical_id",
        },
    ]
    const getPlaceholder = (dataIndex: string) => {
        switch (dataIndex) {
            case 'major_id':
                return 'Chọn chuyên ngành'
            case 'org_manage_id':
                return 'Chọn đơn vị'
            case 'type_id':
                return 'Chọn loại CSKT'
            default:
                return 'Chọn đơn vị'
        }
    }
    const getDataSelect = (dataIndex: string) => {
        if (["ward_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.wards,
                "name",
                "id"
            );
        }
        if (["major_id"].includes(dataIndex)) {
            return dataSelection.majors
        }
        if (["type_id"].includes(dataIndex)) {
            return dataSelection.type;
        }
        if (["level"].includes(dataIndex)) {
            return LEVEL_SCOPE_OPTIONS;
        }
        if (["is_offical"].includes(dataIndex)) {
            return OFFICAL_OPTIONS;
        }
        if (["org_manage_id"].includes(dataIndex)) {
            return dataSelection.organizations;
        }
        if (["name"].includes(dataIndex)) {
            return dataSelection.technical_orgs;
        }
    };
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <Space
            {...SPACE_PROP_DEFAULT}
            className="flex"
            size={20}>
            {isLoading ? (
                <Skeleton />
            ) : (
                <>
                    <Flex
                        align="center"
                        justify="space-between"
                        className={`absolute bg-white left-0 right-0 px-6 pb-3 z-50`}
                    >
                        <p className="modal-title">{`${detail ? 'Chỉnh sửa' : 'Thêm mới'} ${{
                            [ModalType.CSBD]: 'cơ sở kỹ thuật',
                            [ModalType.ToBD]: 'tổ BĐKTcđ',
                        }[modalType] || 'trạm CQĐT'
                            }`}</p>
                        <Button type="primary" onClick={hanldeFinish}>{'Lưu thông tin'}</Button>
                    </Flex>
                    <Form
                        form={form}
                        className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
                        onFinish={onFinish}
                    >
                        {dataInput.map((value: any, i: number) => {
                            return (
                                <ItemComponent
                                    key={i}
                                    hidden={value?.hidden}
                                    title={value?.title}
                                    rules={value?.rules}
                                    content={value?.content}
                                    require={value?.require}
                                    statusUpdate={true}
                                    dataIndex={value.dataIndex}
                                    treeField={{
                                        isSelect:
                                            value?.dataIndex === "org_manage_id" ||
                                            value?.dataIndex === "type_id" ||
                                            value?.dataIndex === "major_id",
                                        dataSelect: getDataSelect(value?.dataIndex),
                                        placeholder: getPlaceholder(value?.dataIndex),
                                    }}
                                    selectField={{
                                        isSelect:
                                            value?.dataIndex === "level" ||
                                            value?.dataIndex === "is_offical",
                                        dataSelect: getDataSelect(value?.dataIndex),
                                    }}
                                    autoCompleteField={{
                                        formData: form,
                                        isSelect:
                                            value?.dataIndex === "name",
                                        dataSelect: getDataSelect(value?.dataIndex),
                                    }}
                                    addressField={value?.dataIndex === "ward_id"}
                                />
                            )
                        })}
                    </Form>
                </>
            )}

        </Space >
    );
}

export default TechnicalAssuranceAction;
