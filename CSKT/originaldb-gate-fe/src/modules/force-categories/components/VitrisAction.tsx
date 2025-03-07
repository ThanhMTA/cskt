import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { selectMap } from "@app/core/helper";
import { VitriData } from "../types/vitris.types";
import {
    createVitri,
    getVitriDetail,
    getVitriList,
    removeVitri,
    updateVitri
} from "../store/Vitris.action";
import { IOrganizationsDataSelection } from "../interfaces/Organizations.interface";
import { getWard } from "@app/modules/it-categories/store/Ward.action";
import { getMilitaryDistrict } from "@app/modules/it-categories/store/MilitaryDistrict.action";
import { ORGANIZATIONS_FIELD_NAME } from "../constants/Organizations.constant";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";
import { getOrganizationTree } from "@app/modules/techinical-organization/stores/TechnicalOrganization.action";
import { arrayToTree } from "performant-array-to-tree";

type ViTrisActionType = {
    action: Action;
    detail?: VitriData;
    parent_id?: string;
};

const ViTrisAction: React.FC<ViTrisActionType> = ({
    action,
    detail,
    parent_id,
}) => {
    const [form] = Form.useForm();
    const loading = useLoading();
    const modal = useModal();
    const { openMessage } = useMessage();
    const [parentDetail, setParentDetail] = useState<VitriData | null>(
        null
    );
    const [dataSelection, setDataSelection] =
        useState<IOrganizationsDataSelection>({
            organizations: [],
            militaryDistrict: [],
            wards: [],
        });

    //   const getOrgCode = async (orgId?: string) => {
    //     const res = await getOrganizationCode(orgId);
    //     form.setFieldValue("code", res || "");
    //     if (parent_id) {
    //       const response = await getOrganizationsDetail(parent_id, {});
    //       setParentDetail(response || null);
    //     }
    //   };

    const fetchData = async () => {
        const responses = await Promise.all([
            await getOrganizationTree({}),
            await getWard({}, {}),
            await getMilitaryDistrict({}, {}),
        ]);
        setDataSelection({
            organizations: arrayToTree([...responses[0]], { dataField: null }),
            wards: responses[1],
            militaryDistrict: responses[2],
        });
    };

    const onFinish = async () => {
        try {
            loading.show();
            let ward_id = null;
            const value: any = form.getFieldsValue();
            const parent_id = value?.parent_id?.value
                ? value?.parent_id?.value
                : value?.parent_id;
            const military_distric_id = value?.military_distric_id?.value
                ? value?.military_distric_id?.value
                : value?.military_distric_id;
            ward_id = value?.ward_id?.ward ? value?.ward_id?.ward : null;
            const tree_level =
                parentDetail?.tree_level && +parentDetail?.tree_level + 1;

            switch (action) {
                case Action.Update:
                    await updateVitri(detail?.id, {
                        ...value,
                        // military_distric_id,
                        parent_id,
                        ward_id,
                    });
                    openMessage({
                        type: "success",
                        content: `Cập nhật thành công`,
                    });
                    break;
                case Action.Create:
                    await createVitri({
                        ...value,
                        // military_distric_id,
                        parent_id,
                        ward_id,
                        tree_level,
                    });
                    openMessage({
                        type: "success",
                        content: `Thêm mới thành công`,
                    });
                    form.resetFields();
                    break;
                case Action.View:
                    break;
            }
            handleSuccess();
        } catch (e: any) {
            console.log(e);
            openMessage({
                type: "error",
                content: e?.message || "Lỗi hệ thống",
            });
            loading.hide();
        }
    };
    const hanldeFinish = () => {
        if (action === Action.View) {
            handleSuccess();
            return;
        } else {
            form.submit();
        }
    };

    const handleSuccess = () => {
        loading.hide();
        modal.closeModal({ success: true });
    };
    const handleDelete = async () => {
        try {
            if (detail?.children?.length > 0) {
                openMessage({
                    type: "warning",
                    content: "Đ/c không thể xóa khi đang tồn tại mã con!",
                });
            } else {
                await removeVitri(detail?.id);
                openMessage({
                    type: "success",
                    content: `Xóa thành công`,
                });
                // handleSuccess();
                loading.hide();
                modal.closeModal({});
            }
        } catch (error: any) {
            console.log(error);
            openMessage({
                type: "error",
                content: error?.message || "Lỗi hệ thống",
            });
        }
    };

    useEffect(() => {
        fetchData();
        // if (action === Action.Create) {
        //   getOrgCode(parent_id ?? "");
        // }
    }, []);


    const dataInput = useMemo(
        () => [
            {
                title: "Vị trí",
                content: detail?.name || null,
                require: true,
                dataIndex: "name",
                rules: [
                    { required: true, message: `Thông tin không được để trống!` },
                ],
            },
            {
                title: "Tên viết tắt",
                content: detail?.short_name || null,
                dataIndex: "short_name"
            },
             {
                title: "Đơn vị cha",
                content: detail?.parent_id || null,
                dataIndex: "parent_id"
            },
             {
                title: "tree level",
                content: detail?.tree_level|| null,
                dataIndex: "tree_level"
            },

            {
                title: "Địa chỉ",
                content: detail?.ward_id || null,
                dataIndex: "ward_id"
            },
            {
                title: "Trạng thái",
                content: (detail?.is_enable === undefined ? true : detail?.is_enable),

                dataIndex: "is_enable"
            },
        ], [detail]
    )
    //   const getDataSelect = (dataIndex: string) => {
    //     if (["military_district_id"].includes(dataIndex)) {
    //       return selectMap(dataSelection?.militaryDistrict, "name", "id");
    //     }
    //   };

    return (
        <Space {...SPACE_PROP_DEFAULT} className="flex" size={20}>
            <Flex
                align="center"
                justify="space-between"
                className={`absolute bg-white left-0 right-0 px-6 pb-3 z-50`}
            >
                <ModalCategoryActionHeader
                    name="Vị Trí"
                    action={action}
                    hanldeFinish={hanldeFinish}
                    handleDelete={handleDelete}
                />
            </Flex>
            <Form
                form={form}
                className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
                onFinish={onFinish}
                disabled={action === Action.View}
            >
                {action === Action.Update || action === Action.Create ? (
                    <>
                        {dataInput.map((value: any, i: number) => {
                            return (
                                <ItemComponent
                                    key={i}
                                    title={value?.title}
                                    rules={value?.rules}
                                    content={value?.content}
                                    require={value?.require}
                                    statusUpdate={true}
                                    dataIndex={value.dataIndex}
                                    // disable={
                                    //   (parent_id !== null &&
                                    //     (value.dataIndex === "code" ||
                                    //       value.dataIndex === "parent_id")) ||
                                    //   (action === Action.Update && value.dataIndex === "code")
                                    //     ? true
                                    //     : false
                                    // }
                                    addressField={value?.dataIndex === "ward_id"}
                                    treeField={{
                                        isSelect: value?.dataIndex === "parent_id",
                                        dataSelect: dataSelection.organizations,
                                    }}
                                    // selectField={{
                                    //     isSelect:
                                    //         value?.dataIndex === "military_district_id",
                                    //     dataSelect: getDataSelect(value.dataIndex),
                                    // }}
                                    // isNumberField={value.dataIndex === "order_number"}
                                    isRadioField={value?.dataIndex === "is_enable"}
                                />
                            );
                        })}
                    </>
                ) : (
                    <>
                        {dataInput.map((value: any, i: number) => {
                            return (
                                <div className="flex flex-col pb-4">
                                    <ItemComponent
                                        key={i}
                                        title={value?.title}
                                        content={value?.content}
                                        require={value?.require}
                                        statusUpdate={false}
                                        dataIndex={value.dataIndex}
                                        isRadioField={value?.dataIndex === "is_enable"}
                                    />
                                </div>
                            );
                        })}
                    </>
                )}

            </Form>
        </Space>
    );
};

export default ViTrisAction;
