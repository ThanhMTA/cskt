import {
  Button,
  Card,
  Form,
  Grid,
  Input,
  notification,
  theme,
  Typography,
} from "antd";

import {
  AiOutlineUser,
  AiOutlineLock,
  AiFillInfoCircle,
  AiOutlineCheck,
} from "react-icons/ai";
import cache from "@app/core/cache";
import { LOCAL_USER_KEY } from "@app/configs/auth.config";
import { useNavigate } from "react-router-dom";
import HTTP from "@app/core/http";
import { useLoading } from "@app/contexts/LoadingContext";
import { logoImage } from "@app/configs/assets.config.ts";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;
type LoginProps = {
  username: string;
  password: string;
  remember?: boolean;
};
export default function App() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const loading = useLoading();
  const [api, contextHolder] = notification.useNotification();
  const onFinish = async (values: LoginProps) => {
    try {
      loading.show();
      if (!values.username.includes("@")) {
        values.username = `${values.username}@email.com`;
      }
      const res = await HTTP.login(values.username, values.password, {
        mode: "json",
      });
      console.log("res: ", JSON.stringify(res));
      cache.setCache(LOCAL_USER_KEY, {
        token: res.access_token,
        refresh_token: res.refresh_token,
        expires: res.expires,
      });
      HTTP.setToken(res.access_token);
      api.open({
        message: "Thông báo",
        description: "Đăng nhập thành công",
        className: "custom-class",
        icon: <AiOutlineCheck style={{ color: "#28BA36" }} />,
      });
      navigate("/");
      loading.hide();
    } catch (e) {
      loading.hide();
      api.open({
        message: "Thông báo",
        description: "Đăng nhập không thành công",
        className: "custom-class",
        icon: <AiFillInfoCircle style={{ color: "#E7381D" }} />,
      });
    }
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      backgroundColor: "#147AFF",
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <section style={styles.section}>
      {contextHolder}
      <div style={styles.container}>
        <Card>
          <div
            style={{
              ...styles.header,
              textAlign: "center",
            }}
          >
            {/* <Button
              onClick={() => {
                cache.setCache(LOCAL_USER_KEY,{token:'ssss'});
                navigate('/')
              }}
            >
              Fake Login
            </Button> */}
            <img src={logoImage} className="h-10 mx-auto" />

            <Title style={styles.title}>Đăng nhập</Title>
            <Text style={styles.text}>CỔNG DỮ LIỆU BCTT</Text>
          </div>
          <Form
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  type: "string",
                  required: true,
                  message: "Vui lòng nhập Tên đăng nhập!",
                },
              ]}
            >
              <Input prefix={<AiOutlineUser />} placeholder="Tên đăng nhập" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập Mật khẩu!",
                },
                // {
                //   pattern: REGEX_STRONG_PASSWORD,
                //   message:'Mật khẩu bao gồm 8 ký tự, trong đó có ít nhất 1 ký tự viết hoa, 1 chữ thường, 1 ký tự đặc biệt và 1 ký tự số'
                // }
              ]}
            >
              <Input.Password
                prefix={<AiOutlineLock />}
                type="password"
                placeholder="Mật khẩu"
              />
            </Form.Item>
            {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ</Checkbox>
              </Form.Item> */}

            <Form.Item style={{ marginBottom: "0px" }}>
              <Button
                block={true}
                type="primary"
                htmlType="submit"
                className="mt-2"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </section>
  );
}
