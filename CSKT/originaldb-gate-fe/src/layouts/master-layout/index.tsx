import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Flex,
  Layout,
  Space,
  notification,
} from "antd";
import { backgroundImage, logoImage } from "@app/configs/assets.config";
import {
  CaretDownOutlined,
  CheckOutlined,
  FileDoneOutlined,
  HomeOutlined,
  KeyOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuOutlined,
  PhoneOutlined,
  SwapOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ActorCSKT, NAVBAR_ITEMS } from "@app/configs/menu.config";
import { makeid } from "@app/core/helper";
const { Header, Footer, Content } = Layout;
import cache from "@app/core/cache";
import { LOCAL_USER_KEY } from "@app/configs/auth.config";
import { MenuKey, RouterUrl } from "@app/enums/router.enum";
import { userStore } from "@app/store/user/user.store";
import { globalStore } from "@app/store/global.store";
import { AvailableRoles, DirectusRoles } from "@app/types/types";
import { updateUserRole } from "@app/core/api";
import HTTP from "@app/core/http";
import { refresh } from "@directus/sdk";
import { useModal } from "@app/contexts/ModalContext";
import PasswordAction from "./PasswordAction";

const navbarItems: any[] = [...NAVBAR_ITEMS];
const Administrator = "Administrator";
const NavbarMenu: React.FC = () => {
  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(true);
  const { actorsDirectusRoles } = globalStore();
  const { userInfo } = userStore();
  const menuOnChange = (event: any) => {
    setShowSubMenu(false);
    if (event?.key === "0") {
      navigate("/");
      return;
    }
    navigate(event?.route);
    setTimeout(() => setShowSubMenu(true), 500);
  };

  useEffect(() => {
    if (ActorCSKT.includes(userInfo?.role?.name)) {
      navigate("/quan-ly-cskt");
    }
  }, [userInfo]);
  return (
    <nav className="w-full">
      <ul className="text-white">
        <Flex justify="center" gap={25}>
          {navbarItems?.map((item: any) => {
            if (
              item?.actor?.includes(userInfo?.role?.name) ||
              userInfo?.role?.name === Administrator
            )
              return (
                <li
                  key={item?.key || makeid()}
                  className={`group relative center ${ActorCSKT.includes(userInfo?.role?.name) ? "hidden" : ""
                    }`}
                  onClick={() =>
                    // item?.key === MenuKey.Categories &&
                    setShowSubMenu((prev) => !prev)
                  }
                  onMouseLeave={() =>
                    // item?.key === MenuKey.Categories &&
                    setShowSubMenu(false)
                  }
                  onMouseEnter={() =>
                    // item?.key === MenuKey.Categories && 
                    setShowSubMenu(true)
                  }
                >
                  <NavLink
                    to={item?.route}
                    onClick={item.onClick ? item.onClick : undefined}
                  >
                    {({ isActive }: any) => (
                      <div
                        className={`h-10 px-6 text-[16px] center rounded-primary gap-x-3 ${isActive ? "bg-primary" : ""
                          }`}
                      >
                        <p className="text-white text-nowrap">{item?.label}</p>
                        {item?.children?.length ? (
                          <CaretDownOutlined
                            className={`mt-1 text-white transition-transform duration-500 ${showSubMenu ? "rotate-180" : "rotate-0"
                              }`}
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    )}
                  </NavLink>
                  {item?.children && showSubMenu && (
                    <div
                      key={item?.key || makeid()}
                      className="popupMenu absolute overflow-hidden leading-none min-w-[300px] opacity-1 hidden group-hover:block top-full bg-white z-[10000] rounded-primary text-black shadow-#0"
                    >
                      {item?.children
                        ?.filter(
                          (x: any) =>
                            actorsDirectusRoles?.findIndex(
                              (ac) => ac?.actors_id?.short_name === x.key
                            ) > -1
                        )
                        .map((x: any) => {
                          const item = actorsDirectusRoles?.find(
                            (ac) => ac?.actors_id?.short_name === x.key
                          );
                          if (!item) {
                            return x;
                          }
                          return {
                            ...x,
                            order_number: (item?.actors_id as any).order_number,
                          };
                        })
                        .sort(
                          (a: any, b: any) =>
                            (a?.order_number ?? Number.MAX_SAFE_INTEGER) -
                            (b.order_number ?? Number.MAX_SAFE_INTEGER)
                        )
                        ?.map((child: any) => {
                          return (
                            <NavLink
                              to={child?.route}
                              className="text-[initial]"
                              key={child?.key || makeid()}
                            >
                              {({ isActive }: any) => (
                                <p
                                  className={`h-10 flex items-center cursor-pointer hover:bg-secondary px-3 duration-300 ${isActive ? "font-black" : ""
                                    }`}
                                  onClick={() => menuOnChange(child)}
                                >
                                  {/* {child?.label} */}
                                  {/* {`Dữ liệu dùng chung - ${actorsDirectusRoles?.find(ac => ac?.actors_id?.short_name === child.key)?.actors_id?.name}`} */}
                                  {
                                    actorsDirectusRoles?.find(
                                      (ac) =>
                                        ac?.actors_id?.short_name === child.key
                                    )?.actors_id?.name
                                  }
                                </p>
                              )}
                            </NavLink>
                          );
                        })}
                    </div>
                  )}
                </li>
              );
          })}
        </Flex>
      </ul>
    </nav>
  );
};

const FooterMasterLayout: React.FC = () => {
  return (
    <div className="flex">
      <Space
        className="mt-3 absolute z-10 container"
        direction="vertical"
        size={"small"}
      >
        <Divider className="flex w-full m-0" />
        <span className="font-bold text-lg">BCTT Data gate</span>
        <Flex align="center" gap={20}>
          <Flex align="center" gap={8}>
            <HomeOutlined />
            <span>Số 1, Giang Văn Minh</span>
          </Flex>
          <Flex align="center" gap={8}>
            <PhoneOutlined />
            <a href="tel:098 123456789" className="text-inherit">
              098 123456789
            </a>
          </Flex>
          <Flex align="center" gap={8}>
            <MailOutlined />
            <a href="mailto:support@company.com" className="text-inherit">
              support@company.com
            </a>
          </Flex>
        </Flex>
        <span>TTKT CNC @2024</span>
      </Space>
    </div>
  );
};

const MasterLayout: React.FC = () => {
  const [noti, notificationContextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const { userInfo, getUserInformation, setClearUserInfo } = userStore();
  const location = useLocation();
  const { openModal } = useModal();

  const {
    setCurrentPath,
    getActorsDirectusRoles,
    getAvailableRoles,
    availableRoles,
  } = globalStore();
  const unauthorized = () => {
    logout();
    window.location.reload();
  };
  const permissionDenied = () => {
    noti.error({
      message: "Không có quyền truy cập.",
    });
  };
  const logout = () => {
    cache.remove(LOCAL_USER_KEY);
    // window.location.href = "/";
    setClearUserInfo();
    navigate(RouterUrl.Login);
  };
  const handleChangeRole = async (role: AvailableRoles) => {
    console.log("role: ", role);

    openModal(
      <div className="flex flex-col">
        <div>
          {" "}
          Bạn có chắc chắn muốn đổi sang quyền{" "}
          <span className="text-blue-600"> {role?.role_id?.name} </span>
        </div>
        <Button
          className="text-white"
          type={"primary"}
          onClick={async () => {
            try {
              console.log("update roles");
              await updateUserRole((role?.role_id as DirectusRoles)?.id || "");
              const res = cache.getCache(LOCAL_USER_KEY);
              if (res && res.data && res.data.refresh_token) {
                const authData = await HTTP.request(
                  refresh("json", res.data.refresh_token)
                );
                cache.setCache(LOCAL_USER_KEY, {
                  token: authData.access_token,
                  refresh_token: authData.refresh_token,
                  expires: authData.expires,
                  expires_at: authData.expires_at,
                });
                HTTP.setToken(authData.access_token);
              }
              // const res = await HTTP.request(refresh("cookie"));
              // cache.setCache(LOCAL_USER_KEY, { token: res.access_token });
              // HTTP.setToken(res.access_token);
              window.location.reload();
            } catch (e) {
              console.log(e);
            }
          }}
        >
          Xác nhận
        </Button>
      </div>,
      {
        onOk: async () => {
          console.log("vao day");
          try {
            console.log("update roles");
            await updateUserRole((role?.role_id as DirectusRoles)?.id || "");
            const res = cache.getCache(LOCAL_USER_KEY);
            if (res && res.data && res.data.refresh_token) {
              const authData = await HTTP.request(
                refresh("json", res.data.refresh_token)
              );
              cache.setCache(LOCAL_USER_KEY, {
                token: authData.access_token,
                refresh_token: authData.refresh_token,
                expires: authData.expires,
                expires_at: authData.expires_at,
              });
              HTTP.setToken(authData.access_token);
            }
            // const res = await HTTP.request(refresh("cookie"));
            // cache.setCache(LOCAL_USER_KEY, { token: res.access_token });
            // HTTP.setToken(res.access_token);
            window.location.reload();
          } catch (e) {
            console.log(e);
          }
        },
        onModalClose: () => { },
      }
    );

    // .confirm({
    //   title: `Xác nhận`,
    //   content: (
    //     <span>
    //       Bạn có chắc chắn muốn đổi sang quyền{" "}
    //       <span className="text-blue-600">{role?.role_id?.name}</span>?
    //     </span>
    //   ),
    //   okText: "Đồng ý",
    //   cancelText: "Hủy",
    //   onOk: ,
    // });
    // console.log("Confirmed: ", confirmed);
  };

  const getRefreshTokenFromStorage = () => {
    const res = cache.getCache(LOCAL_USER_KEY);
    if (res && res.data && res.data.refresh_token) {
      return res.data.refresh_token;
    }
    return null;
  };
  const getTimeoutFromStorage = () => {
    const res = cache.getCache(LOCAL_USER_KEY);
    if (res && res.data && res.data.expires) {
      return res.data.expires;
    }
    return 60000;
  };
  const refreshToken = async () => {
    try {
      const refresh_token = getRefreshTokenFromStorage();
      if (refresh_token) {
        const authData = await HTTP.request(refresh("json", refresh_token));
        console.log("Auto refresh token");
        console.log("authData: ", JSON.stringify(authData));
        cache.setCache(LOCAL_USER_KEY, {
          token: authData.access_token,
          refresh_token: authData.refresh_token,
          expires: authData.expires,
          expires_at: authData.expires_at,
        });
        HTTP.setToken(authData.access_token);
      }
    } catch (error) {
      logout();
    } finally {
      const timeoutId = setTimeout(
        refreshToken,
        getTimeoutFromStorage() - 10000
      );
      return () => clearTimeout(timeoutId);
    }
  };
  const handleChangePassword = () => {
    openModal(
      <PasswordAction />,
      {
        width: '30vw',
        onModalClose() {

        },
      }
    )
  }
  const handleDownloadFile = () => {
    try {
      const fullUrl = `${import.meta.env.VITE_PUBLIC_API_URL}assets/${userInfo?.role?.file_id ?? ''}?download`;
      const anchor = document.createElement("a");
      anchor.href = fullUrl;
      anchor.download = 'Hướng dẫn sử dụng';
      anchor.target = "_blank";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (error: any) {
      console.log('error: ', error)
    }
  }


  useEffect(() => {
    document.addEventListener("unauthorized", unauthorized);
    document.addEventListener("permissionDenied", permissionDenied);
    getUserInformation();
    getActorsDirectusRoles();
    refreshToken();
  }, []);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);
  useEffect(() => {
    if (userInfo) {
      getAvailableRoles(userInfo?.id);
    }
  }, [userInfo]);
  return (
    <Layout
      className="min-h-[100vh]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "top",
        backgroundSize: "100vw",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundOrigin: "border-box",
      }}
    >
      {notificationContextHolder}
      <Header className="h-[75px] text-white bg-transparent flex items-center justify-between laptop:grid grid-cols-4 container">
        <Flex
          gap={18}
          align="center"
          className="col-span-1 cursor-pointer"
          onClick={() => {
            navigate("");
          }}
        >
          <img
            onClick={() => navigate("/")}
            src={logoImage}
            alt=""
            className="cursor-pointer"
          />
          <span className="font-bold text-xl">Binh chủng TTLL</span>
        </Flex>
        <Flex
          className="col-span-2 hidden laptop:flex"
          align="center"
          justify="center"
        >
          <NavbarMenu />
        </Flex>
        <Flex
          align="center"
          gap={20}
          justify="end"
          className="col-span-1 hidden laptop:flex"
        >
          <span className="text-[16px]" onClick={() => { }}>
            {userInfo?.first_name} {userInfo?.last_name}
          </span>
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: [
                {
                  label: (
                    <Flex gap={12}>
                      <Dropdown
                        className="border-none"
                        menu={{
                          items: availableRoles?.map((x) => ({
                            key: x.id,
                            label:
                              x?.role_id?.id === userInfo?.role?.id ? (
                                <Flex
                                  gap={12}
                                  onClick={() => handleChangeRole(x)}
                                  className="text-blue-600"
                                >
                                  <span>{x?.role_id?.name}</span>
                                  <CheckOutlined />
                                </Flex>
                              ) : (
                                <Flex
                                  gap={12}
                                  onClick={() => handleChangeRole(x)}
                                >
                                  {x?.role_id?.name}
                                </Flex>
                              ),
                          })),
                        }}
                        arrow={{ pointAtCenter: true }}
                      >
                        <Flex gap={12}>
                          <SwapOutlined /> Thay đổi quyền
                        </Flex>
                      </Dropdown>
                    </Flex>
                  ),
                  key: 1,
                },
                {
                  label: (
                    <Flex gap={12} onClick={handleChangePassword}>
                      <KeyOutlined />
                      <span>Đổi mật khẩu</span>
                    </Flex>
                  ),
                  key: 2,
                },
                {
                  label: (
                    <Flex gap={12} onClick={handleDownloadFile}>
                      <FileDoneOutlined />
                      <span>Hướng dẫn sử dụng</span>
                    </Flex>
                  ),
                  key: 3,
                },
                {
                  label: (
                    <Flex gap={12} onClick={logout}>
                      <LogoutOutlined />
                      <span>Đăng xuất</span>
                    </Flex>
                  ),
                  key: 4,
                },
              ],
            }}
          >
            <Avatar
              shape="square"
              className="bg-white cursor-pointer"
              icon={<UserOutlined className="text-black" />}
            />
          </Dropdown>
        </Flex>
        <Flex
          justify="center"
          align="center"
          className="bg-white h-10 aspect-square rounded-primary cursor-pointer flex laptop:hidden"
        >
          <MenuOutlined className="text-black text-base" />
        </Flex>
      </Header>
      <Content className="bg-transparent">
        <Outlet />
      </Content>
      <Footer className="flex border-[1px] border-gray-200 justify-center laptop:grid grid-cols-4 container">
        <FooterMasterLayout />
      </Footer>
    </Layout>
  );
};

export default MasterLayout;
