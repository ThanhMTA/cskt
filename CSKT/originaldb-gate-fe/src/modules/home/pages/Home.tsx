import { AppstoreFilled, BuildFilled, SearchOutlined } from "@ant-design/icons";
import { Card, Flex, Input, Space, SpaceProps, Statistic } from "antd";
import "./Home.scss";
import CountUp from "react-countup";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { CATEGORIES_DATABASE } from "@app/constants/home.constant";
import { icCanBoHome } from "@app/configs/assets.config";
import { MenuKey } from "@app/enums/router.enum";
import { NAVBAR_ITEMS } from "@app/configs/menu.config";
import DataBaseITCard from "../components/DataBaseITCard";
import { globalStore } from "@app/store/global.store";
import { ActorsDirectusRoles, Tables } from "@app/types/types";
import { TableType } from "@app/enums";
import { userStore } from "@app/store/user/user.store";

const SpacePropsHome: SpaceProps = {
  className: "flex",
  direction: "vertical",
  size: 50,
};

const getIcon = (key: string) => {
  for (const item of NAVBAR_ITEMS) {
    if (item?.children?.length > 0) {
      const child = item?.children?.find((x: any) => x.key === key);
      if (child) {
        return child?.icon || icCanBoHome;
      }
    }
  }
  return icCanBoHome;
};
const getTables = (item: any) => {
  return (item?.actors_id as any)?.tables
    ? (item?.actors_id as any)?.tables
        ?.filter((x: any) => x?.tables_id?.type === TableType.DANH_SACH)
        .map((x: any) => ({ ...x.tables_id }))
    : [];
};

const Home: React.FC = () => {
  // VARIABLES
  const { userInfo } = userStore();
  const [databaseGridMode, setDatabaseGridMode] = useState(false);
  const navigate = useNavigate();
  const demoRef = useRef<any>();
  const [width, setWidth] = useState(0);
  const { actorsDirectusRoles } = globalStore();
  const [tables, setTables] = useState<Tables[]>();
  useEffect(() => {
    setWidth((demoRef.current.offsetWidth - 16 * 2 - 24 * 4) / 4.5);
  }, []);

  useEffect(() => {
    if (userInfo) {
      const tableList = [...actorsDirectusRoles].reduce(
        (prev, curr) => [...prev, ...getTables(curr)],
        []
      );
      setTables(
        (tableList as Tables[])?.sort(
          (a, b) =>
            (a?.order_number ?? Number.MAX_SAFE_INTEGER) -
            (b?.order_number ?? Number.MAX_SAFE_INTEGER)
        )
      );
    }
  }, [actorsDirectusRoles, userInfo]);

  return (
    <Space {...SpacePropsHome}>
      <Flex
        vertical
        gap={30}
        className="text-center text-white max-w-fit container"
      >
        <h2 className="uppercase font-extrabold text-[56px] tracking-wider	">
          Cổng dữ liệu BCTT
        </h2>
        <Input
          className="rounded-full w-full px-6"
          size="large"
          placeholder="Tìm kiếm"
          suffix={<SearchOutlined />}
        />
      </Flex>
      <Flex
        gap={20}
        vertical
        className="w-full container card-glassmorphism rounded-primary p-4 "
      >
        <Flex
          className="bg-white p-2 rounded-[inherit]"
          gap={12}
          justify="space-between"
        >
          <span className="uppercase font-bold">
            CƠ SỞ DỮ LIỆU HỆ THỐNG THÔNG TIN
          </span>
          <Flex gap={12}>
            <span>{tables?.length} danh sách</span>
            <button
              className="hover:text-primary duration-300"
              onClick={() => setDatabaseGridMode(!databaseGridMode)}
              style={{
                fontSize: "16px",
              }}
            >
              {databaseGridMode ? <BuildFilled /> : <AppstoreFilled />}
            </button>
          </Flex>
        </Flex>
        <div ref={demoRef}>
          {/* <div 
            className="data-type-list flex gap-6 overflow-x-auto pb-3 rounded-primary scroll-smooth snap-x"
          >
            {
              actors?.map((item:ActorsData) => {
                return <span key={makeid()} className=""><DataBaseITCard width={width} itemCard={item}/></span>
              })
            }
          </div> */}
          {databaseGridMode ? (
            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-6">
              {tables?.map((item: Tables) => {
                return (
                  <span key={item?.id}>
                    <DataBaseITCard itemCard={item} />
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="data-type-list flex gap-6 overflow-x-auto pb-3 rounded-primary scroll-smooth snap-x">
              {tables?.map((item: Tables) => {
                return (
                  <span key={item?.id} className="">
                    <DataBaseITCard width={width} itemCard={item} />
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </Flex>

      <Space {...SpacePropsHome} className="bg-white flex py-[32px]">
        <div className="container bg-secondary rounded-primary p-8">
          <p className="uppercase font-bold text-center text-base">
            Hiện trạng kết nối chia sẻ
          </p>
          <div className="mt-8 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-6 laptop:gap-20">
            {[
              {
                title: "Tổng số giao dịch",
                value: 155767,
              },
              {
                title: "Dữ liệu đã khai thác",
                value: 3832,
              },
              {
                title: "Tài khoản truy nhập",
                value: 1210,
              },
              {
                title: "API được chia sẻ",
                value: 5600,
              },
            ]?.map((item: { title: string; value: number }, index: number) => {
              return (
                <Flex
                  key={index}
                  vertical
                  gap={16}
                  justify="center"
                  align="center"
                  className="bg-primary text-white flex-1 p-4 rounded-primary"
                >
                  <Statistic
                    title=""
                    value={item?.value}
                    formatter={() => {
                      return (
                        <CountUp
                          end={item?.value as number}
                          className="font-bold text-white text-4xl"
                          separator="."
                        />
                      );
                    }}
                  />
                  <span className="text-lg text-center">{item?.title}</span>
                </Flex>
              );
            })}
          </div>
        </div>
        <Flex
          vertical
          gap={25}
          className="container bg-secondary rounded-primary p-8"
        >
          <Flex justify="space-between">
            <p className="uppercase font-bold text-base">
              Cơ sở dữ liệu danh mục
            </p>

            {actorsDirectusRoles ? (
              <p className="font-bold">
                {actorsDirectusRoles?.filter((it) => it.is_enable).length <
                  10 && "0"}
                {actorsDirectusRoles?.filter((it) => it.is_enable).length} Phân
                hệ
              </p>
            ) : (
              <p className="font-bold">0 Phân hệ</p>
            )}
          </Flex>
          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-x-[70px] gap-y-12">
            {actorsDirectusRoles?.map(
              (actorRole: ActorsDirectusRoles, index: number) => {
                if (actorRole?.is_enable === false) return null;
                return (
                  <Card
                    bordered={false}
                    key={index}
                    className="p-3 aspect-4/3 hover:shadow-#0 hover:-translate-y-3 duration-500 cursor-pointer"
                    onClick={() => {
                      const menuCategory = NAVBAR_ITEMS?.find(
                        (item) => item?.key === MenuKey.Categories
                      );
                      if (menuCategory?.children?.length) {
                        const route = menuCategory?.children?.find(
                          (mc: any) =>
                            mc?.key === actorRole?.actors_id?.short_name
                        )?.route;
                        if (route) {
                          navigate(route);
                        }
                      }
                    }}
                  >
                    <Flex
                      vertical
                      justify="space-between"
                      align="center"
                      gap={12}
                    >
                      <img
                        src={
                          getIcon(actorRole?.actors_id?.short_name) ||
                          icCanBoHome
                        }
                        className="w-20 h-20 p-4"
                        alt=""
                      />
                      <p className="font-bold text-base text-center line-clamp-2 h-12">
                        {/* {item?.label} */}
                        {actorRole?.actors_id?.name}
                      </p>
                      <p className="font-bold text-primary">
                        {actorRole?.actors_id?.tables?.length} danh mục
                        {/* {item?.categoryCount} danh mục */}
                      </p>
                    </Flex>
                  </Card>
                );
              }
            )}
          </div>
        </Flex>
      </Space>
    </Space>
  );
};

export default Home;
