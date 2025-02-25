/* eslint-disable no-case-declarations */
import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Skeleton, Space } from "antd";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useMessage } from "@app/contexts/MessageContext";
import { EngineRoom } from "../types/EngineRoom.type";
import { updateEngineRoom, createEngineRoom, removeEngineRoom, getEngineRoomDetail } from "../store/EngineRoom.action";
import { IEngineRoomActionSelect } from "../interfaces/EngineRoom.interface";
import { getWard } from "../store/Ward.action";
import ItemComponent from "../../../components/ItemsComponent";
import { getOrganizationTree } from "@app/modules/techinical-organization/stores/TechnicalOrganization.action";
import { arrayToTree } from "performant-array-to-tree";

type Props = {
    id?: string,
    action: Action
}


export default function EngineRoomAction({ id, action }: Props) {
    const [form] = Form.useForm();
    const loading = useLoading();
    const modal = useModal();
    const { openMessage } = useMessage();
    const [detail, setDetail] = useState<EngineRoom>();
    const [isLoading, setIsIoading] = useState<boolean>(false);
    const [dataSelection, setDataSelection] = useState<IEngineRoomActionSelect>({
        organizations: [],
        wards: [],
    });
    const onFinish = async () => {
        try {
            loading.show()
            let ward_id = null;
            const value: any = form.getFieldsValue();

            switch (action) {
                case Action.Update:
                    const org_id = value?.org_id?.value ? value?.org_id?.value : value?.org_id;
                    const org_use_id = value?.org_use_id?.value ? value?.org_use_id?.value : value?.org_use_id;
                    const org_technical_id = value?.org_technical_id?.value ? value?.org_technical_id?.value : value?.org_technical_id;
                    const org_support_id = value?.org_support_id?.value ? value?.org_support_id?.value : value?.org_support_id;
                    ward_id = value?.ward_id?.ward ? value?.ward_id?.ward : null;
                    await updateEngineRoom(detail?.id, { ...value, org_id, org_use_id, org_technical_id, org_support_id, ward_id });
                    openMessage({
                        type: "success",
                        content: `Cập nhật thành công`
                    })
                    break;
                case Action.Create:
                    ward_id = value?.ward_id?.ward ? value?.ward_id?.ward : null;
                    await createEngineRoom({ ...value, ward_id });
                    openMessage({
                        type: "success",
                        content: `Thêm mới thành công`
                    })
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
            loading.hide()
        }
    }
    const handleDelete = async () => {
        try {
            await removeEngineRoom(detail?.id);
            openMessage({
                type: "success",
                content: `Xóa thành công`
            })
            // handleSuccess();
            loading.hide()
            modal.closeModal({})
        } catch (error: any) {
            console.log(error);
            openMessage({
                type: "error",
                content: error?.message || "Lỗi hệ thống",
            });
        }
    }
    const hanldeFinish = () => {
        if (action === Action.View) {
            handleSuccess();
            return;
        } else {
            onFinish();
            return;
            // const value: EngineRoom = form.getFieldsValue();
            // console.log('asdsad: ', value)
            // form.submit();
        }
    }
    const handleSuccess = () => {
        loading.hide()
        modal.closeModal({ success: true })
    }

    const getDetail = async () => {
        try {
            setIsIoading(true)
            const res = await getEngineRoomDetail(id, {});
            setDetail(res);
            setIsIoading(false)
        } catch (e) {
            console.log(e)
            setIsIoading(false)
        }
    }
    // functions
    const fetchData = async () => {
        const responses = await Promise.all([
            await getOrganizationTree({}),
            await getWard({}, {}),
        ]);
        setDataSelection({
            organizations: arrayToTree([...responses[0]], { dataField: null }),
            wards: responses[1],
        })
    }

    const dataInput = useMemo(
        () => [
            {
                title: "Tên phòng máy CNTT",
                content: detail?.name || null,
                require: true,
                dataIndex: "name",
                rules: [
                    { required: true, message: `Hãy nhập thông tin cho trường tên phòng máy CNTT` },
                ],
            },
            {
                title: "Tên viết tắt",
                content: detail?.short_name || null,
                require: false,
                dataIndex: "short_name",
            },
            {
                title: "Số điện thoại",
                content: detail?.phone_number || null,
                require: false,
                dataIndex: "phone_number",
            },
            {
                title: "Cách liên lạc",
                content: detail?.contact_method || null,
                require: false,
                dataIndex: "contact_method",
            },
            {
                title: "Đơn vị cấp trên quản lý",
                content: detail?.org_id || null,
                require: false,
                dataIndex: "org_id",
            },
            {
                title: "Đơn vị khai thác",
                content: detail?.org_use_id || null,
                require: false,
                dataIndex: "org_use_id",
            },
            {
                title: "Đơn vị đảm bảo kỹ thuật",
                content: detail?.org_technical_id || null,
                require: false,
                dataIndex: "org_technical_id",
            },
            {
                title: "Đơn vị hỗ trợ bảo đảm kỹ thuật",
                content: detail?.org_support_id || null,
                require: false,
                dataIndex: "org_support_id",
            },
            {
                title: "Địa bàn",
                content: detail?.ward_id || null,
                require: false,
                dataIndex: "ward_id",
            },
            {
                title: "Vị trí phòng máy",
                content: detail?.address || null,
                require: false,
                dataIndex: "address",
            },
            {
                title: "Kinh độ (Độ N)",
                content: detail?.longitude || null,
                require: false,
                dataIndex: "longitude",
            },
            {
                title: "Vĩ độ (Độ E)",
                content: detail?.latitude || null,
                require: false,
                dataIndex: "latitude",
            },
            {
                title: "Diện tích PMC (m2)",
                content: detail?.area || null,
                require: false,
                dataIndex: "area",
                rules:
                    [
                        {
                            validator: (rule: any, value: any) => {
                                if (Number(value) < 0) {
                                    return Promise.reject(`Giá trị không hợp lệ.`);
                                }
                                return Promise.resolve();
                            }
                        }
                    ]
            },
            {
                title: "Số lượng máy chủ vật lý",
                content: detail?.n_phy_server || null,
                require: false,
                dataIndex: "n_phy_server",
                rules:
                    [
                        {
                            validator: (rule: any, value: any) => {
                                if (Number(value) < 0) {
                                    return Promise.reject(`Giá trị không hợp lệ.`);
                                }
                                return Promise.resolve();
                            }
                        }
                    ]
            },
            {
                title: "Số lượng máy chủ ảo",
                content: detail?.n_vir_server || null,
                require: false,
                dataIndex: "n_vir_server",
                rules:
                    [
                        {
                            validator: (rule: any, value: any) => {
                                if (Number(value) < 0) {
                                    return Promise.reject(`Giá trị không hợp lệ.`);
                                }
                                return Promise.resolve();
                            }
                        }
                    ]
            },
            {
                title: "Tổng số lượng ứng dụng, dịch vụ",
                content: detail?.sum_app_service || null,
                require: false,
                dataIndex: "sum_app_service",
                rules:
                    [
                        {
                            validator: (rule: any, value: any) => {
                                if (Number(value) < 0) {
                                    return Promise.reject(`Giá trị không hợp lệ.`);
                                }
                                return Promise.resolve();
                            }
                        }
                    ]
            },
            {
                title: "Năng lực xử lý CPU (GHz)",
                content: detail?.ability_cpu || null,
                require: false,
                dataIndex: "ability_cpu",
                rules:
                    [
                        {
                            validator: (rule: any, value: any) => {
                                if (Number(value) < 0) {
                                    return Promise.reject(`Giá trị không hợp lệ.`);
                                }
                                return Promise.resolve();
                            }
                        }
                    ]
            },
            {
                title: "Tổng dung lượng RAM (GB)",
                content: detail?.sum_ram || null,
                require: false,
                dataIndex: "sum_ram",
                rules:
                    [
                        {
                            validator: (rule: any, value: any) => {
                                if (Number(value) < 0) {
                                    return Promise.reject(`Giá trị không hợp lệ.`);
                                }
                                return Promise.resolve();
                            }
                        }
                    ]
            },
            {
                title: "Băng thông (Mbps)",
                content: detail?.bandwidth || null,
                require: false,
                dataIndex: "bandwidth",
                rules:
                    [
                        {
                            validator: (rule: any, value: any) => {
                                if (Number(value) < 0) {
                                    return Promise.reject(`Giá trị không hợp lệ.`);
                                }
                                return Promise.resolve();
                            }
                        }
                    ]
            },
            {
                title: "Tài nguyên lưu trữ (TB)",
                content: detail?.n_storage || null,
                require: false,
                dataIndex: "n_storage",
                rules:
                    [
                        {
                            validator: (rule: any, value: any) => {
                                if (Number(value) < 0) {
                                    return Promise.reject(`Giá trị không hợp lệ.`);
                                }
                                return Promise.resolve();
                            }
                        }
                    ]
            },
            {
                title: "Số lượng tủ RACK",
                content: detail?.n_rack || null,
                require: false,
                dataIndex: "n_rack",
                rules:
                    [
                        {
                            validator: (rule: any, value: any) => {
                                if (Number(value) < 0) {
                                    return Promise.reject(`Giá trị không hợp lệ.`);
                                }
                                return Promise.resolve();
                            }
                        }
                    ]
            },
            {
                title: "Mật độ tài nguyên lưu trữ (%)",
                content: detail?.n_percent_density || null,
                require: false,
                dataIndex: "n_percent_density",
                rules:
                    [
                        {
                            validator: (rule: any, value: any) => {
                                if (Number(value) < 0) {
                                    return Promise.reject(`Giá trị không hợp lệ.`);
                                }
                                return Promise.resolve();
                            }
                        }
                    ]
            },
            {
                title: "Đánh giá khả năng khai thác, vận hành (Điểm mạnh, yếu)",
                content: detail?.comment || null,
                require: false,
                dataIndex: "comment",
            },
            {
                title: "Hồ sơ kỹ thuật",
                content: detail?.url_file_path || null,
                require: false,
                dataIndex: "url_file_path",
            },
            {
                title: "Số thứ tự",
                content: detail?.order_number || null,
                require: false,
                dataIndex: "order_number",
            },
            {
                title: "Có đảm bảo nguồn điện",
                content: detail?.has_power_source || null,
                require: false,
                dataIndex: "has_power_source",
            },
            {
                title: "Có chống sét",
                content: detail?.has_lighting_protect || null,
                require: false,
                dataIndex: "has_lighting_protect",
            },
            {
                title: "Có phòng cháy, chữa cháy",
                content: detail?.has_fighting_protect || null,
                require: false,
                dataIndex: "has_fighting_protect",
            },
            {
                title: "Trạng thái",
                content: (detail?.is_enable === undefined ? true : detail?.is_enable),

                require: false,
                dataIndex: "is_enable",
            },
        ],
        [detail]
    )
    useEffect(() => {
        fetchData();
        if (id) {
            getDetail();
        }
    }, [id])
    return (
        <Space
            {...SPACE_PROP_DEFAULT}
            className="flex"
            size={20}
        >
            <Flex
                align="center"
                justify="space-between"
                className={`absolute bg-white left-0 right-0 px-6 pb-3 z-50`}
            >
                <ModalCategoryActionHeader name="phòng máy CNTT" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
            </Flex>
            {isLoading ? <><Skeleton /></> : <Form
                form={form}
                className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-4 gap-4"
                onFinish={onFinish}
                requiredMark={false}
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
                                    treeField={{
                                        isSelect:
                                            value?.dataIndex === "org_id" ||
                                            value?.dataIndex === "org_use_id" ||
                                            value?.dataIndex === "org_support_id" ||
                                            value?.dataIndex === "org_technical_id",
                                        dataSelect: dataSelection.organizations,
                                    }}
                                    addressField={value?.dataIndex === "ward_id"}
                                    isNumberField={
                                        value?.dataIndex === "area" ||
                                        value?.dataIndex === "n_phy_server" ||
                                        value?.dataIndex === "sum_app_service" ||
                                        value?.dataIndex === "ability_cpu" ||
                                        value?.dataIndex === "sum_ram" ||
                                        value?.dataIndex === "bandwidth" ||
                                        value?.dataIndex === "n_storage" ||
                                        value?.dataIndex === "n_rack" ||
                                        value?.dataIndex === "n_percent_density" ||
                                        value?.dataIndex === "order_number" ||
                                        value?.dataIndex === "n_vir_server"
                                    }
                                    isRadioField={
                                        value?.dataIndex === "is_enable" ||
                                        value?.dataIndex === "has_fighting_protect" ||
                                        value?.dataIndex === "has_lighting_protect" ||
                                        value?.dataIndex === "has_power_source"
                                    }
                                />
                            )
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
                                        isRadioField={
                                            value?.dataIndex === "is_enable" ||
                                            value?.dataIndex === "has_fighting_protect" ||
                                            value?.dataIndex === "has_lighting_protect" ||
                                            value?.dataIndex === "has_power_source"
                                        }
                                    />
                                </div>
                            );
                        })}
                    </>
                )}
            </Form>}

        </Space>
    );
}

