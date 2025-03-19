import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Space, Tabs } from "antd";
import PageName from "@app/components/PageName";
import { LayoutSpace } from "@app/enums";
import { useMemo, useRef, useState } from "react";
import { TabsProps } from "antd/lib";
import { useLocation, useNavigate } from "react-router-dom";
import { SystemType } from "../enum/SystemCategory.enum";
import { HistoryOutlined, UserOutlined } from "@ant-design/icons";
import ActivityManagement from "../components/Activity";
import AccountManagement from "../components/Account";
import FailureManagement from "../components/Failure";
import TTBManagement from "../components/QLTTB";
import In_OutManagement from "../components/In_out";

export default function TestManagement() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>(SystemType.TTB);
    const modalType = useRef<SystemType>(SystemType.TTB);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const handleStatusChange = (value: any) => {
        params.set('tab', value);
        navigate({ search: params.toString() });
    };
    const itemsTabs: TabsProps["items"] = useMemo(() => [
        {
            key: SystemType.TTB,
            label: "Quản lý trang thiết bị",
            children: <div className="bg-[#F5F5F6] h-svh">
                <TTBManagement/>
            </div>,
            icon: <HistoryOutlined />,
        },
        {
            key: SystemType.Failure,
            label: "Quản lý sự cố",
            children: <div className="bg-[#F5F5F6] h-svh">
                <FailureManagement />
            </div>,
            icon: <HistoryOutlined/>,
        },
        {
            key: SystemType.Input_Output, 
            label: "Quản lý nhập xuất",
            children: <div className="bg-[#F5F5F6] h-svh">
                <In_OutManagement/>
            </div>,
            icon: <HistoryOutlined/>,
        },
        {
            key: SystemType.Account,
            label: "Quản lý tài khoản",
            children: <div className="bg-[#F5F5F6] h-svh">
                <AccountManagement />
            </div>,
            icon: <UserOutlined />,
        },
    ], [])



    return (
        <Space {...SPACE_PROP_DEFAULT}>
            <PageName title="QUẢN Lý TRANG THIẾT BỊ" />
            <section className="relative">
                <div
                    className={`bg-white w-full absolute`}
                    style={{
                        height: `calc(100%)`,
                        top: `${LayoutSpace.TabMargin - 100}px`,
                    }}
                >
                </div>
                <section className="-mt-3">
                    <div className="mx-20">
                        <div
                            className="flex flex-col rounded-lg pb-0 ring-[10px]
             ring-white/30 border-b border-solid border-gray-300 bg-[#F5F5F6]] bg-white overflow-hidden">
                            <div className="flex relative">
                                <div className="w-screen">
                                    <Tabs
                                        className="px-2 rounded-lg
            ring-white/30 border-b border-solid border-gray-300 bg-[#F5F5F6] overflow-hidden"
                                        activeKey={activeTab}
                                        items={itemsTabs}
                                        size="small"
                                        onChange={(value: any) => {
                                            modalType.current = value;
                                            setActiveTab(value.toString())
                                            handleStatusChange(value);
                                        }}
                                        tabBarStyle={{
                                            background: '#F5F5F6',
                                            height: '50px',
                                            marginBottom: 8,
                                            fontSize: '12px',
                                            borderRadius: 10,
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                </section>
            </section>
        </Space>
    );
}