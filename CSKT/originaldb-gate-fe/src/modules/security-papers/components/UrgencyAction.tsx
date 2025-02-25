import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Skeleton, Space } from "antd";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useMessage } from "@app/contexts/MessageContext";
import { Urgency } from "../types/Urgency.type";
import { updateUrgency, createUrgency, removeUrgency, getUrgencyDetail } from "../store/Urgency.action";
import ItemComponent from "@app/components/ItemsComponent";

type Props = {
    id?: string,
    action: Action
}

export default function UrgencyAction({ id, action }: Props) {
    const [form] = Form.useForm();
    const loading = useLoading();
    const modal = useModal();
    const { openMessage } = useMessage();

    const [detail, setDetail] = useState<Urgency>();

    const [isLoading, setIsIoading] = useState<boolean>(false);
    const onFinish = async () => {
        try {
            loading.show()
            const value: Urgency = form.getFieldsValue();
            switch (action) {
                case Action.Update:
                    await updateUrgency(detail?.id, value);
                    openMessage({
                        type: "success",
                        content: `Cập nhật thành công`
                    })
                    break;
                case Action.Create:
                    await createUrgency(value);
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
            await removeUrgency(detail?.id);
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
            form.submit();
        }
    }
    const handleSuccess = () => {
        loading.hide()
        modal.closeModal({ success: true })
    }
    const getDetail = async () => {
        try {
            setIsIoading(true)
            const res = await getUrgencyDetail(id, {});
            console.log(res);
            setDetail(res);
            setIsIoading(false)
        } catch (e) {
            console.log(e)
            setIsIoading(false)
        }
    }
    const dataInput = useMemo(
        () => [
            {
                title: "Tên độ khẩn",
                content: detail?.name || null,
                require: true,
                dataIndex: "name",
                rules: [
                    { required: true, message: `Thông tin không được để trống` },
                ],
            },
            {
                title: "Ký hiệu độ khẩn",
                content: detail?.short_name || null,
                dataIndex: "short_name",
            },
            {
                title: "Mã mở rộng",
                content: detail?.code_ex || null,
                dataIndex: "code_ex",
            },
            {
                title: "Mã định danh mở rộng",
                content: detail?.id_ex || null,
                dataIndex: "id_ex",
            },
            {
                title: "Số thứ tự",
                content: detail?.order_number || null,
                dataIndex: "order_number",
            },
            {
                title: "Trạng thái",
                content: (detail?.is_enable === undefined ? true : detail?.is_enable),

                dataIndex: "is_enable",
            },
        ], [detail]
    )

    useEffect(() => {
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
                <ModalCategoryActionHeader name="độ khẩn" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
            </Flex>
            {isLoading ? <><Skeleton /></> : <Form
                form={form}
                className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
                initialValues={detail}
                disabled={action === Action.View}
                onFinish={onFinish}
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
                                    isNumberField={value?.dataIndex === "order_number"}
                                    isRadioField={value?.dataIndex === "is_enable"}
                                    dataIndex={value.dataIndex}
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
                                        isRadioField={value?.dataIndex === "is_enable"}
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

