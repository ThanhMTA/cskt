import { Tabs, TabsProps } from "antd";
import { Outlet } from "react-router-dom";
import Activities from "./Activities";
import { useEffect, useMemo, useState } from "react";
import { PrivateRoute } from "@app/routing/PrivateRoute";
import TableDetail from "./TableDetail";
import { useLocation } from "react-router-dom";
import ApiDocs from "./ApiDocs";

export default function CategoryTabs() {
  const location = useLocation();
  const [title, setTitle] = useState<string>("");
  const itemsTabs: TabsProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: "Dữ liệu",
        children: (
          <div className="bg-white py-0">
            <div className="container">
              <PrivateRoute>
                <Outlet />
              </PrivateRoute>
            </div>
          </div>
        ),
      },
      {
        key: "2",
        label: "Thông tin khai thác",
        children: (
          <div className="bg-white py-0">
            <div className="container">
              <PrivateRoute>
                <Activities />
              </PrivateRoute>
            </div>
          </div>
        ),
      },
      // {
      //     key: "3",
      //     label: "Thông tin chung",
      //     children: <div className="bg-white py-0">
      //         <div className="container">
      //             <PrivateRoute>
      //                 <TableDetail />
      //             </PrivateRoute>
      //         </div>
      //     </div>
      // },
      // {
      //     key: "4",
      //     label: "Phân quyền khai thác",
      //     children: <div className="bg-white py-0">
      //         <div className="container">
      //             <PrivateRoute>
      //                 <TableDetail />
      //             </PrivateRoute>
      //         </div>
      //     </div>
      // },
      {
        key: "5",
        label: "Thông tin API",
        children: (
          <div className="bg-white py-0">
            <div className="container">
              <PrivateRoute>
                <TableDetail />
              </PrivateRoute>
            </div>
          </div>
        ),
      },
      {
        key: "6",
        label: "API Docs",
        children: (
          <div className="bg-white py-0">
            <div className="container">
              <PrivateRoute>
                <ApiDocs />
              </PrivateRoute>
            </div>
          </div>
        ),
      },
    ],
    []
  );
  useEffect(() => {
    setTitle(location?.state?.title);
  }, [location]);
  return (
    <div>
      <div className="pb-8 -mt-2">
        <span className="text-[16px] font-bold leading-7">
          {title?.replace("DM", "Danh mục")}
        </span>
      </div>
      <div className="custom-tabs-v1">
        <Tabs
          className="-mt-[30px] "
          tabBarStyle={{
            backgroundColor: "#F5F5F6",
            borderRadius: 4,
            borderBottomWidth: 1,
            marginBottom: -20,
            fontSize: 12,
            fontWeight: 400,
          }}
          defaultActiveKey="1"
          items={itemsTabs}
          onChange={() => {}}
          type="line"
          destroyInactiveTabPane={true}
        />
      </div>
    </div>
  );
}
