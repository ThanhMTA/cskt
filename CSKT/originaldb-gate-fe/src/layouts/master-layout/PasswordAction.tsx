


import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Button, Flex, Form, Input, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { useLoading } from "@app/contexts/LoadingContext";
import { AiOutlineUser } from "react-icons/ai";
import { updateCurrentUser } from "@app/core/api";
import cache from "@app/core/cache";
import { LOCAL_USER_KEY } from "@app/configs/auth.config";
import { userStore } from "@app/store/user/user.store";
import { useEffect, useState } from "react";
import HTTP from "@app/core/http";

const COUNTDOWN_TIME = 3;
const CountDown = () => {
    const [time, setTime] = useState(COUNTDOWN_TIME);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((time: any) => {
                if (time === 0) {
                    clearInterval(timer);
                    return 0;
                } else return time - 1;
            });
        }, 1000);
    }, []);
    return <>
        <p>Cập nhật thành công.</p>
        <p>Hệ thống sẽ đăng xuất sau: {time}s</p>
    </>
}
const PasswordAction: React.FC = () => {
    // const navigate = useNavigate();
    const [form] = Form.useForm();
    const loading = useLoading();
    const { openMessage } = useMessage();
    const { setClearUserInfo, userInfo } = userStore();
    const [isLoading, setIsLoading] = useState(false);


    const onFinish = async () => {
        try {
            loading.show();
            setIsLoading(true);
            const { old_password, new_password } = form.getFieldsValue();
            //verify password
            try {
                await HTTP.login(userInfo?.email as string, old_password);
            } catch (error: any) {
                form.setFields([
                    {
                        name: 'old_password',
                        errors: ['Mật khẩu cũ không đúng!'],
                    },
                ]);
                throw error; 
            }
            await updateCurrentUser({
                password: new_password
            });
            openMessage({
                type: 'success',
                content: <CountDown />
            })
            loading.hide();
            cache.remove(LOCAL_USER_KEY);
            setClearUserInfo();
            setTimeout(() => {
                setIsLoading(false);
                window.location.reload();
            }, COUNTDOWN_TIME * 1000)
        } catch (e: any) {
            console.log(e);
            openMessage({
                type: "error",
                content: 'Cập nhật thất bại. Vui lòng kiểm tra lại thông tin'
            });
            loading.hide()
        } finally {
            setIsLoading(false);
        }
    }

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
                <p className="font-bold text-[24px]">{`Đổi mật khẩu`}</p>
            </Flex>
            <Form
                form={form}
                layout="vertical"
                className="p-0 rounded-primary mt-10 grid grid-cols-1 gap-2"
                onFinish={onFinish}
                disabled={isLoading}
            >
                <Form.Item
                    label={'Mật khẩu cũ'}
                    name="old_password"
                    rules={[
                        {
                            type: "string",
                            required: true,
                            message: "Vui lòng nhập mật khẩu cũ!",
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<AiOutlineUser />}
                        placeholder="Mật khẩu cũ"
                    />
                </Form.Item>
                <Form.Item
                    className="-mt-2"
                    label={'Mật khẩu mới'}
                    name="new_password"
                    rules={[
                        {
                            type: "string",
                            required: true,
                            message: "Vui lòng nhập mật khẩu mới!",
                        },
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
                        }
                    ]}
                >
                    <Input.Password
                        prefix={<AiOutlineUser />}
                        placeholder="Mật khẩu mới"
                    />
                </Form.Item>
                <Form.Item
                    className="-mt-2"
                    label={'Nhập lại mật khẩu mới'}
                    name="retype_password"
                    rules={[
                        {
                            type: "string",
                            required: true,
                            message: "Vui lòng nhập mật khẩu mới!",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('new_password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<AiOutlineUser />}
                        placeholder="Nhập lại mật khẩu"
                    />
                </Form.Item>
                <Form.Item style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', marginTop: -5 }} >
                    <Button style={{ display: 'flex' }} block={true} type="primary" htmlType="submit" className="mt-0">
                        Lưu
                    </Button>
                </Form.Item>
            </Form>

        </Space>
    )
}
export default PasswordAction;
