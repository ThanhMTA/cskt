import { Action } from "@app/enums";
import { Button, DatePicker, Divider, Flex, Form, Input, Popconfirm, Radio, Select, Space, Tooltip, TreeSelect } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { DirectusUsers } from "@app/types/types";
import { useMessage } from "@app/contexts/MessageContext";
import { useLoading } from "@app/contexts/LoadingContext";
import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { BUTTON_LABEL, MESSAGE_CONTENT } from "@app/constants/common.constant";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { arrayToTree } from "performant-array-to-tree";
import { createPersonal, createUser, delUser, getCommonCategory, getOrganizationTree, getRoles, updateUser } from "../stores/Account.action";
import dayjs from "dayjs";
import { useModal } from "@app/contexts/ModalContext";

interface IAccountDrawer {
    action: Action;
    detail?: DirectusUsers;
}
interface ICommonCategory {
    role: any[],
    rank: any[],
    position: any[],
}
const STATUS = [
    {
        key: 'draft',
        value: 'draft',
        label: 'Đã khoá'
    },
    {
        key: 'active',
        value: 'active',
        label: 'Đang hoạt động'
    },
]
const AccountDrawer: React.FC<IAccountDrawer> = ({
    action,
    detail,
}) => {
    const [treeLine, setTreeLine] = useState(true);
    const [showLeafIcon, setShowLeafIcon] = useState(false);
    const [form] = Form.useForm();
    const [organization, setOrganization] = useState<any[]>([]);
    const [commonCategories, setCommonCategories] = useState<ICommonCategory>({
        role: [],
        rank: [],
        position: [],
    });
    const { openMessage } = useMessage();
    const loading = useLoading();
    const modal = useModal();
    const handleSuccess = () => {
        loading.hide()
        modal.closeModal({ success: true })
    }
    const handleDelete = async () => {
        try {
            await delUser(detail?.id);
            handleSuccess();
        } catch (error) {
            openMessage({
                type: "success",
                content: `Xoá thành công`
            })
        }
    }
    const onFinish = async () => {
        try {
            loading.show()
            const value: any = form.getFieldsValue();
            const status = value?.status ? value?.status : 'active';
            const role = value?.role;
            const personal: any = {
                name: value?.name,
                rank_id: value?.rank_id,
                position_id: value?.position_id,
                phone_number: value?.phone_number,
                org_id: value?.org_id,
                birthday: value?.birthday,
            }
            if (action === Action.Update) {
                await updateUser(detail?.id, {
                    personal_id: personal,
                    status: status,
                    role: role,
                });
                openMessage({
                    type: "success",
                    content: `Cập nhật thành công`
                })
            } else if (action === Action.Create) {
                const res = await createPersonal(personal);
                if (res.id) {
                    try {
                        await createUser({
                            personal_id: res.id,
                            password: value?.password,
                            email: value?.email,
                            status: status,
                            role: role,
                        });
                        openMessage({
                            type: "success",
                            content: `Thêm mới thành công`
                        })
                        form.resetFields();
                    } catch (e: any) {
                        console.log('error: ', e);
                        openMessage({
                            type: 'error',
                            content: e.errors[0].message
                        })
                    }
                }
            }
        } catch (e: any) {
            console.log(e);
            openMessage({
                type: "error",
                content: e?.message || "Lỗi hệ thống",
            });
        } finally {
            handleSuccess();
        }
    }

    const fetchData = async () => {
        try {
            const [org, rank, position, role] = await Promise.all([
                getOrganizationTree(),
                getCommonCategory('rank_categories'),
                getCommonCategory('position_categories'),
                getRoles(),
            ]);
            setOrganization(arrayToTree(org, { dataField: null }));
            setCommonCategories({
                rank: rank,
                position: position,
                role: role
            })
        } catch (error) {
            console.log('error: ', error)
        }
    }
    useEffect(() => {
        fetchData();
        // setPreviewImage(detail?.personal_id?.personal_id);
        form.setFieldsValue({
            name: detail?.personal_id?.name || null,
            email: detail?.email || null,
            rank_id: detail?.personal_id?.rank_id?.id || null,
            position_id: detail?.personal_id?.position_id?.id || null,
            org_id: detail?.personal_id?.org_id?.id || null,
            phone_number: detail?.personal_id?.phone_number || null,
            status: action === Action.Create ? 'active' : (detail?.status || null),
            role: detail?.role?.id || null,
            birthday: detail?.personal_id?.birthday ? dayjs(detail?.personal_id?.birthday) : null,
        });
    }, [detail])

    return (
        <Space
            {...SPACE_PROP_DEFAULT}
            className="flex"
            size={20}>
            <Flex
                align="center"
                justify="space-between"
                className="px-6"
            >
                {action === Action.Create ? (
                    <div className="text-[22px] font-bold">{`Thông tin cán bộ`}</div>
                ) : (
                    <div className="text-[22px] font-bold">{`Thông tin cán bộ ${detail?.personal_id?.name}`}</div>
                )}
                <div className="flex flex-row gap-2">
                    {action === Action.View ? (
                        <>
                            <Tooltip title="Xóa">
                                <Popconfirm
                                    title={MESSAGE_CONTENT.DELETE}
                                    onConfirm={() => { }}
                                    okText={BUTTON_LABEL.CORRECT}
                                    cancelText={BUTTON_LABEL.NO}
                                >
                                    <Button type="default" shape="circle" icon={<DeleteOutlined />} />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip title="Chỉnh sửa">
                                <Button
                                    onClick={handleDelete}
                                    type="default"
                                    icon={<EditOutlined />}
                                    shape="circle"
                                />
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip title="Xóa">
                                <Popconfirm
                                    title={MESSAGE_CONTENT.DELETE}
                                    onConfirm={handleDelete}
                                    okText={BUTTON_LABEL.CORRECT}
                                    cancelText={BUTTON_LABEL.NO}
                                >
                                    <Button type="default" shape="circle" icon={<DeleteOutlined />} />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip title="Lưu">
                                <Button
                                    onClick={() => {
                                        form.submit();
                                    }}
                                    type="default"
                                    icon={<CheckOutlined />}
                                    shape="circle"
                                />
                            </Tooltip>
                        </>
                    )}


                </div>
            </Flex>
            <Divider className="m-0" />
            <Form
                form={form}
                onFinish={onFinish}
                layout='horizontal'
                labelCol={{ span: 9 }}
                labelAlign="left"
                className="form-item rounded px-6 py-2"
                requiredMark={(label: ReactNode, info: { required: boolean }) => {
                    return (
                        <>
                            {label} {info?.required ? <span className="text-red"> &nbsp;*</span> : ""}
                        </>
                    );
                }}
                disabled={action === Action.View}
            >
                <Form.Item
                    className="mb-4"
                    name={"name"}
                    label={
                        <div className="flex text-[15px] justify-items-start gap-x-1">
                            Họ và tên
                        </div>
                    }
                    rules={[{ required: true, message: "Họ và tên không được để trống" }]}
                >
                    {action === Action.Create || Action.Update ? (
                        <Input placeholder="Nhập họ và tên" className="border-0" style={{ resize: "none" }} />
                    ) : (
                        <p className="px-[12px] text-[15px]">
                            {form.getFieldValue("name") || ""}
                        </p>
                    )}
                </Form.Item>
                <Form.Item
                    className="mb-4"
                    name={"email"}
                    label={
                        <div className="flex text-[15px] justify-items-start gap-x-1">
                            Email
                        </div>
                    }
                    rules={[
                        { required: true, message: "Email không được để trống" },
                        {
                            type: "email",
                            message: "Định dạng email không hợp lệ",
                        },]}
                >
                    {action === Action.Create || Action.Update ? (
                        <Input inputMode="email" disabled={!(action === Action.Create)} placeholder="Nhập email" className="border-0 " style={{ resize: "none" }} />
                    ) : (
                        <p className="px-[12px] text-[15px]">
                            {form.getFieldValue("email") || ""}
                        </p>
                    )}
                </Form.Item>
                {action === Action.Create && (
                    <>
                        <Form.Item
                            name={"password"}
                            rules={[
                                { required: true, message: "Mật khẩu không được để trống" },
                                {
                                    validator(_, value) {
                                        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
                                        if (!value || regex.test(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
                                            )
                                        );
                                    },
                                },
                            ]}
                            label={
                                <div className="flex text-[15px] justify-items-start gap-x-1">
                                    Mật khẩu
                                </div>
                            }
                        >
                            <Input.Password
                                className="border-0" style={{ resize: "none" }}
                                placeholder="Mật khẩu"
                            />
                        </Form.Item>
                        <Form.Item
                            label={
                                <div className="flex text-[15px] justify-items-start gap-x-1">
                                    Nhập lại mật khẩu
                                </div>
                            }
                            name="retype_password"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập lại mật khẩu!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Mật khẩu không khớp!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                className="border-0" style={{ resize: "none" }}
                                placeholder="Nhập lại mật khẩu"
                            />
                        </Form.Item>
                    </>
                )}

                <Form.Item
                    className="mb-4"
                    name={"rank_id"}
                    label={
                        <div className="flex text-[15px] justify-items-start gap-x-1">
                            Cấp bậc
                        </div>
                    }
                >
                    {action === Action.Create || Action.Update ? (
                        <Select
                            className="flex border-0 w-full"
                            allowClear
                            placeholder="Chọn cấp bậc"
                            labelRender={props => props.label}
                            options={commonCategories.rank}
                            showSearch
                            filterOption={(input: string, option: any) => {
                                return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
                            }}
                        />
                    ) : (
                        <p className="px-[12px] text-[15px]">
                            {form.getFieldValue("rank_id") || ""}
                        </p>
                    )}
                </Form.Item>
                <Form.Item
                    className="mb-4"
                    name={"position_id"}
                    label={<div className="flex text-[15px] justify-items-start gap-x-1">Chức vụ</div>}>
                    {action === Action.Create || Action.Update ? (
                        <Select
                            className="flex border-0 w-full"
                            allowClear
                            placeholder="Chọn chức vụ"
                            options={commonCategories.position}
                            showSearch
                            filterOption={(input: string, option: any) => {
                                return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
                            }}
                        />
                    ) : (
                        <p className="px-[12px] text-[15px]">
                            {form.getFieldValue("position_id") || ""}
                        </p>
                    )}
                </Form.Item>
                <Form.Item
                    className="mb-4"
                    name={"phone_number"}
                    label={
                        <div className="flex text-[15px] justify-items-start gap-x-1">
                            Số điện thoại
                        </div>
                    }
                >
                    {action === Action.Create || Action.Update ? (
                        <Input placeholder="Nhập số điện thoại" className="border-0 " style={{ resize: "none" }} />
                    ) : (
                        <p className="px-[12px] text-[15px]">
                            {form.getFieldValue("phone_number") || ""}
                        </p>
                    )}
                </Form.Item>
                <Form.Item
                    className="mb-4"
                    name={"org_id"}
                    rules={[{ required: true, message: "Tên đơn vị không được để trống" }]}
                    label={
                        <div className="flex text-[15px] justify-items-start gap-x-1">
                            Tên đơn vị
                        </div>
                    }
                >
                    {action === Action.Create || Action.Update ? (
                        <TreeSelect
                            className="flex border-0 w-full"
                            allowClear
                            treeLine={treeLine && { showLeafIcon }}
                            style={{ width: 120 }}
                            treeData={organization}
                            placeholder="Chọn đơn vị"
                            showSearch
                            filterTreeNode={(input: string, option: any) => {
                                return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
                            }}
                        />
                    ) : (
                        <p className="px-[11px]">
                            {
                                organization?.find((item) => item.id === form.getFieldValue("parent_id"))
                                    ?.name
                            }{" "}
                        </p>
                    )}
                </Form.Item>
                <Form.Item
                    className="mb-4"
                    name={"birthday"}
                    label={
                        <div className="flex text-[15px] justify-items-start gap-x-1">
                            Ngày sinh
                        </div>
                    }
                >
                    {action === Action.Create || Action.Update ? (
                        <DatePicker
                            size='middle'
                            allowClear
                            className="flex border-0 w-full"
                            placeholder="Chọn ngày sinh"
                        />
                    ) : (
                        <p className="px-[12px] text-[15px]">
                            {form.getFieldValue("birthday") || ""}
                        </p>
                    )}
                </Form.Item>
                <Form.Item
                    className="mb-4"
                    name={"role"}
                    label={
                        <div className="flex text-[15px] justify-items-start gap-x-1">
                            Nhóm người dùng
                        </div>
                    }
                >
                    {action === Action.Create || Action.Update ? (
                        <Select
                            className="flex border-0 w-full"
                            allowClear
                            placeholder="Chọn nhóm người dùng"
                            options={commonCategories.role}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    ) : (
                        <p className="px-[12px] text-[15px]">
                            {form.getFieldValue("role") || ""}
                        </p>
                    )}
                </Form.Item>
                <Form.Item
                    className="mb-4"
                    name={"status"}
                    label={<div className="flex text-[15px] justify-items-start gap-x-1">Trạng thái</div>}>
                    {action === Action.Create || Action.Update ? (
                        <Radio.Group name="radiogroup" defaultValue={1}>
                            {STATUS.map((item) => (<Radio value={item.key}>{item.label}</Radio>))}
                        </Radio.Group>
                    ) : (
                        <p className="px-[12px] text-[15px]">
                            {form.getFieldValue("status") || ""}
                        </p>
                    )}
                </Form.Item>
            </Form>
        </Space>

    );
};

export default AccountDrawer;
