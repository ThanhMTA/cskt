import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Breadcrumb, Space, Tabs } from "antd";
import PageName from "@app/components/PageName";
import { LayoutSpace } from "@app/enums";
import { useMemo, useState } from "react";
import { TabsProps } from "antd/lib";
import InformationGeneral from "../components/InformationGeneral";
import TbvtTechnical from "../components/TbvtTechnical";
import CbnvTechnical from "../components/CbnvTechnical";
import { useLocation, useNavigate } from "react-router-dom";
import { ModalType } from "../enum/LevelCategory.enum";

export default function DetailTechnicalOrganization() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>();
    const location = useLocation();
    const { tab = "", name = "" } = location.state || {};
    const handleBreadcrumbClick = (event: any) => {
        event.preventDefault();
        navigate("/quan-ly-cskt", {
            state: { tab }
        })
    };
    const generateTab = () => {
        let sourceTab = ''
        switch (tab) {
            case ModalType.CSBD:
                sourceTab = 'Cơ sở kỹ thuật'
                break;
            case ModalType.ToBD:
                sourceTab = 'Tổ BĐKT cơ động'
                break;
            case ModalType.TrCQDT:
                sourceTab = 'Trạm cáp quang đường trục'
                break;
            default:
                sourceTab = 'Cơ sở kỹ thuật'
                break;
        }
        return sourceTab
    }
    const itemsTabs: TabsProps["items"] = useMemo(() => [
        {
            key: '1',
            label: <span className="px-1">Thông tin chung</span>,
            children: <div className="bg-white -mt-4">
                <InformationGeneral />
            </div>
        },
        {
            key: '2',
            label: <span className="px-1">Danh sách dụng cụ, phương tiện đo</span>,
            children: <div className="bg-white -mt-3">
                <TbvtTechnical />
            </div>
        },
        {
            key: '3',
            label: <span className="px-1">Danh sách CB, NVCMKT</span>,
            children: <div className="bg-white -mt-3">
                <CbnvTechnical />
            </div>
        },
    ], []);



    return (
        <Space {...SPACE_PROP_DEFAULT}>
            <PageName title="QUẢN LÝ CƠ SỞ KỸ THUẬT" />
            <section className="relative">
                <div
                    className={`bg-white w-full absolute z-100`}
                    style={{
                        height: `calc(98%)`,
                        top: `${LayoutSpace.TabMargin - 100}px`,
                    }}
                >
                </div>
                <section className="-mt-3">
                    <div className="container-larger">
                        <div
                            className="rounded-lg ring-[10px]
                            ring-white/30 border-b border-solid border-gray-300 bg-[white] py-2 gap-4 flex-col flex">
                            <div className="relative flex flex-col w-full min-h-screen px-2 gap-2">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="px-2 pt-2 rounded-t-lg flex flex-col">
                                        <Breadcrumb
                                            items={[
                                                {
                                                    className: "text-[15px] text-[#262D34]",
                                                    title: generateTab(),
                                                    href: "/quan-ly-cskt",
                                                    onClick: handleBreadcrumbClick,
                                                },
                                                {
                                                    className: "text-[15px] text-[#262D34]",
                                                    title: name,
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="flex">
                                    <div
                                        className="flex flex-col rounded-lg ring-[12px]
             ring-white/30 bg-white overflow-hidden">
                                        <div className="flex mt-2 relative">
                                            <div className="w-screen">
                                                <Tabs
                                                    className="rounded-lg
            ring-white/30 border-b border-solid border-gray-300 bg-[white] overflow-hidden"
                                                    activeKey={activeTab}
                                                    items={itemsTabs}
                                                    size="small"
                                                    onChange={(value: any) => {
                                                        setActiveTab(value.toString())
                                                    }}
                                                    tabBarStyle={{
                                                        background: '#F5F5F6',
                                                        // height: '45px',
                                                        fontSize: '12px',
                                                        marginLeft: 4,
                                                        marginRight: 4,
                                                        borderRadius: 4,
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </section>

            </section>

        </Space>
    );
}