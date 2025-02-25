import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { useMemo } from "react";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useMessage } from "@app/contexts/MessageContext";
import { updateMilitaryDistrict, createMilitaryDistrict, removeMilitaryDistrict } from "../store/MilitaryDistrict.action";
import { MilitaryDistrict } from "../types/MilitaryDistrict.type";
import ItemComponent from "../../../components/ItemsComponent";
type Props = {
    detail?: MilitaryDistrict,
    action: Action
}
export default function MilitaryDistrictAction({ detail, action }: Props) {
    const [form] = Form.useForm();
    const loading = useLoading();
    const modal = useModal();
    const { openMessage } = useMessage();

    const onFinish = async () => {
        try {
            loading.show()
            const value: MilitaryDistrict = form.getFieldsValue();
            switch (action) {
                case Action.Update:
                    await updateMilitaryDistrict(detail?.id, value);
                    openMessage({
                        type: "success",
                        content: `Cập nhật thành công`
                    })
                    break;
                case Action.Create:
                    await createMilitaryDistrict(value);
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
            await removeMilitaryDistrict(detail?.id);
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
    const dataInput = useMemo(
        () => [
            {
                title: "Tên quân khu",
                content: detail?.name || null,
                require: true,
                dataIndex: "name",
                rules: [
                    { required: true, message: `Hãy nhập thông tin cho trường tên quân khu` },
                ],
            },
            {
                title: "Tên viết tắt",
                content: detail?.short_name || null,
                dataIndex: "short_name",
            },
            {
                title: "Mã",
                content: detail?.code || null,
                dataIndex: "code",
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
                <ModalCategoryActionHeader name="quân khu" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
            </Flex>
            <Form
                form={form}
                className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
                disabled={action === Action.View}
                onFinish={onFinish}
            >
                {/* <Form.Item
                    label="Tên quân khu"
                    name="name"
                    labelCol={{ span: 24 }}
                    rules={[{ required: true }]}
                >
                    <Input variant={variantInput} maxLength={250} />
                </Form.Item>
                <Form.Item
                    label="Tên rút gọn"
                    name="short_name"
                    labelCol={{ span: 24 }}
                >
                    <Input variant={variantInput} maxLength={50} />
                </Form.Item>
                <Form.Item
                    label="Mã"
                    name="code"
                    labelCol={{ span: 24 }}
                >
                    <Input variant={variantInput} maxLength={50} />
                </Form.Item>

                <Form.Item
                    label="Số thứ tự"
                    name="order_number"
                    labelCol={{ span: 24 }}
                >
                    <Input variant={variantInput} />
                </Form.Item>
                {
                    <Form.Item
                        label="Trạng thái"
                        name="is_enable"
                        labelCol={{ span: 24 }}
                    >
                        {
                            action === Action.View ? <IsEnabled is_enable={detail?.is_enable as boolean} /> : <Radio.Group>
                                <Radio value={true}>Hoạt động</Radio>
                                <Radio value={false}>Không hoạt động</Radio>
                            </Radio.Group>
                        }

                    </Form.Item>
                } */}
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
                                    isNumberField={value?.dataIndex === "order_number"}
                                    isRadioField={
                                        value?.dataIndex === "is_enable"
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
                                            value?.dataIndex === "is_enable"
                                        }
                                    />
                                </div>
                            );
                        })}
                    </>
                )}
            </Form>
        </Space>
    );
}

