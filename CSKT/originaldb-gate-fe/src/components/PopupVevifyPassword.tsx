import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { LOCAL_USER_KEY } from "@app/configs/auth.config";
import { useLoading } from "@app/contexts/LoadingContext";
import { useMessage } from "@app/contexts/MessageContext";
import cache from "@app/core/cache";
import HTTP from "@app/core/http";
import { userStore } from "@app/store/user/user.store"
import { AvailableRoles, DirectusRoles } from "@app/types/types"
import { Space, Flex, Input, Button, Form } from "antd";
import useModal from "antd/es/modal/useModal";
import { AiOutlineLock } from "react-icons/ai";
import { updateCurrentUser } from "@app/core/api";
import { useEffect, useState } from "react";
type LoginProps = {
    password: string;
}
type Props = {
    role: AvailableRoles,
}
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
        <p>Tải lại trang để cập nhật dữ liệu sau: {time}s</p>
    </>
}
export default function PopupVevifyPassword({ role }: Props) {
    const { userInfo } = userStore();
    const [form] = Form.useForm();
    const loading = useLoading();
    const { openMessage } = useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const onFinish = async (values: LoginProps) => {
        try {
            try {
                loading.show()
                setIsLoading(true);
                await HTTP.login(userInfo?.email as string, values.password);
                await updateCurrentUser({
                    role: (role?.role_id as DirectusRoles)?.id
                });
                const res = await HTTP.login(userInfo?.email as string, values.password);
                cache.remove(LOCAL_USER_KEY);
                cache.setCache(LOCAL_USER_KEY, { token: res.access_token });
                HTTP.setToken(res.access_token)
                openMessage({
                    type: 'success',
                    content: <CountDown />
                })
                loading.hide();
                setTimeout(() => {
                    setIsLoading(false);
                    window.location.reload();
                }, COUNTDOWN_TIME * 1000)
            } catch (e) {
                loading.hide();
                setIsLoading(false);

                openMessage({
                    type: 'error',
                    content: 'Cập nhật thất bại. Vui lòng kiểm tra lại thông tin'
                })
            }
        } catch (e) {
            console.log(e);
        }
    }
    return <Space
        {...SPACE_PROP_DEFAULT}
        className="flex"
        size={20}
    >
        <Flex
            align="center"
            justify="space-between"
            className={`absolute bg-white left-0 right-0 px-6 pb-3 z-50`}
        >
            <p className="modal-title">Xác nhận</p>
            <Button type="primary" onClick={() => form.submit()}>Cập nhật</Button>
        </Flex>
        <Form
            form={form}
            className="bg-secondary p-3 rounded-primary mt-10"
            onFinish={onFinish}
            disabled={isLoading}
        >
            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập Mật khẩu!",
                    },
                ]}
                labelCol={{ span: 24 }}
            >
                <Input.Password
                    prefix={<AiOutlineLock />}
                    type="password"
                    placeholder="Mật khẩu"
                />
            </Form.Item>

        </Form>
    </Space>
}