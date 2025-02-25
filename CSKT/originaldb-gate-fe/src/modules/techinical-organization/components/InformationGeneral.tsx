import { Button, Form, Popconfirm, Skeleton } from "antd";
import { useEffect, useMemo, useState } from "react";
import "../styles/style.scss"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TechnicalTypesData } from "../types/TechnicalTypes.type";
import { getTechnicalTypesDetail, removeTechnicalTypes } from "../stores/TechnicalTypes.action";
import { getFullAddressString } from "@app/core/helper";
import { BUTTON_LABEL, MESSAGE_CONTENT } from "@app/constants/common.constant";
import { useMessage } from "@app/contexts/MessageContext";
import TechnicalAssuranceAction from "./TechnicalAssuranceAction";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { LevelCategoriesLabel, OfficalLabel } from "../enum/LevelCategory.enum";
export default function InformationGeneral() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { openModal } = useModal();
    const { openMessage } = useMessage()
    const routeParams: any = useParams();
    const location = useLocation();
    const { tab = "" } = location.state || {};
    const { id } = routeParams;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [technicalAssuranceGeneral, setTechnicalAssuranceGeneral] = useState<any | undefined>();
    const getDetail = async () => {
        try {
            setIsLoading(true);
            const res: TechnicalTypesData = await getTechnicalTypesDetail(id, {});
            setTechnicalAssuranceGeneral(res);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    };
    const dataInput = useMemo(
        () => [
            {
                title: `Tên cơ sở kỹ thuật`,
                content: technicalAssuranceGeneral?.name || null,
                require: true,
                dataIndex: "name",
                rules: [
                    { required: true, message: `Thông tin không được để trống!` },
                ],
            },
            {
                title: "Ký hiệu",
                content: technicalAssuranceGeneral?.code || null,
                require: false,
                dataIndex: "code",
            },
            {
                title: "Địa giới hành chính",
                content: technicalAssuranceGeneral?.ward_id || null,
                require: true,
                dataIndex: "ward_id",
                rules: [
                    { required: true, message: `Thông tin không được để trống!` },
                ],
            },
            {
                title: "Số nhà, tên đường",
                content: technicalAssuranceGeneral?.address || null,
                require: false,
                dataIndex: "address",
            },
            {
                title: "Đơn vị quản lý",
                content: technicalAssuranceGeneral?.org_manage_id || null,
                require: false,
                dataIndex: "org_manage_id",
            },
            {
                title: "Loại hình cơ sở kỹ thuật",
                content: technicalAssuranceGeneral?.type_id || null,
                require: false,
                dataIndex: "type_id",
            },
            {
                title: "Phân cấp",
                content: technicalAssuranceGeneral?.level || null,
                require: false,
                dataIndex: "level",
            },
            {
                title: "Chuyên ngành",
                content: technicalAssuranceGeneral?.major_id || null,
                require: false,
                dataIndex: "major_id",
            },
            {
                title: "Hình thức",
                content: technicalAssuranceGeneral?.is_offical,
                require: true,
                dataIndex: "is_offical",
                rules: [
                    { required: true, message: `Thông tin không được để trống!` },
                ],
            },
            {
                title: "Đơn vị tính",
                content: technicalAssuranceGeneral?.dvt || null,
                require: false,
                dataIndex: "dvt",
            },
            {
                title: "Phương tiện cơ động",
                content: technicalAssuranceGeneral?.transport || null,
                require: false,
                dataIndex: "transport",
            },
            {
                title: "Ghi chú",
                content: technicalAssuranceGeneral?.note || null,
                require: false,
                dataIndex: "note",
            },
        ],
        [technicalAssuranceGeneral]
    )
    const renderContent = (dataIndex: string, content: any, dataInput: any[]) => {
        let value: string = '';
        switch (dataIndex) {
            case 'ward_id':
                value = [
                    dataInput.find((value: any) => value?.dataIndex === 'address')?.content,
                    getFullAddressString(content)
                ]
                    .filter(Boolean)
                    .join(', ');
                break;
            case 'level':
                value = LevelCategoriesLabel[content]
                break
            case 'is_offical':
                value = OfficalLabel[content];
                break;
            default:
                value = content?.name ? content.name : content;
                break;
        }
        return value;
    }
    const onDelete = async () => {
        try {
            await removeTechnicalTypes(id);
            openMessage({
                type: "success",
                content: 'Xoá thành công'
            })
            navigate("/quan-ly-cskt", {
                state: { tab }
            })
        } catch (error: any) {
            console.log('error: ', error)
        }
    }
    useEffect(() => {
        if (id) {
            getDetail();
        }
    }, [id]);

    return (
        <Form
            form={form}
            initialValues={{}}
            labelCol={{ span: 24 }}
            onValuesChange={() => { }}
        >
            {isLoading ? <Skeleton /> : (
                <div>
                    <div className="flex flex-row pt-1.5">
                        <div className="flex-col gap-0 bg-white py-2 px-3 flex-1 overflow-auto">
                            <div className="flex justify-end">
                                <div className="flex flex-row gap-2">
                                    <Popconfirm
                                        title={MESSAGE_CONTENT.DELETE}
                                        onConfirm={async () => {
                                            onDelete()
                                        }}
                                        okText={BUTTON_LABEL.CORRECT}
                                        cancelText={BUTTON_LABEL.NO}
                                    >
                                        <Button
                                            size="small"
                                            className="rounded bg-white border-red w-[100px]"
                                            type='primary'
                                            onClick={() => { }}
                                        >
                                            <span className="text-red">Xoá</span>
                                        </Button>
                                    </Popconfirm>

                                    <Button
                                        size="small"
                                        className="rounded w-[100px]"
                                        type="primary"
                                        onClick={async () => {
                                            const res = await getTechnicalTypesDetail(id, {});
                                            if (res)
                                                openModal(
                                                    <TechnicalAssuranceAction action={Action.Update} modalType={tab} detail={res} />,
                                                    {
                                                        width: '55vw',
                                                        onModalClose(res) {
                                                            if (res?.success) {
                                                                getDetail();
                                                            }
                                                        },
                                                    }
                                                )
                                        }}
                                    >
                                        <span className="text-white">Chỉnh sửa</span>
                                    </Button>

                                </div>
                            </div>
                            <div className="grid-cols-1 grid gap-y-5 gap-x-4">
                                {dataInput.map((value: any, i: number) => {
                                    if (value.dataIndex === 'address') return null
                                    return (
                                        <div className="grid grid-cols-[15%_85%] flex-row gap-2" key={i.toString()}>
                                            <span>{value.title}:</span>
                                            {renderContent(value?.dataIndex, value?.content, dataInput)}
                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                    </div>
                </div>

            )}
        </Form>


    )

}