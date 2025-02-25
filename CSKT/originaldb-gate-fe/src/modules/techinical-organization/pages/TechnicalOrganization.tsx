import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Space, Tabs } from "antd";
import PageName from "@app/components/PageName";
import { LayoutSpace } from "@app/enums";
import { useEffect, useMemo, useRef, useState } from "react";
import { TabsProps } from "antd/lib";
import TechnicalAssuranceFacility from "../components/TechnicalAssuranceFacility";
import TechnicalAssuranceTeam from "../components/TechnicalAssuranceTeam";
import { ModalType } from "../enum/LevelCategory.enum";
import { useLocation, useNavigate } from "react-router-dom";
export default function TechnicalOrganization() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>(ModalType.CSBD);
    const modalType = useRef<ModalType>(ModalType.CSBD);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const { tab } = location.state || {};
    const handleStatusChange = (value: any) => {
        params.set('tab', value);
        navigate({ search: params.toString() });
    };
    const itemsTabs: TabsProps["items"] = useMemo(() => [
        {
            key: ModalType.CSBD,
            label: "Cơ sở kỹ thuật",
            children: <div className="bg-[#F5F5F6] h-svh">
                <TechnicalAssuranceFacility />
            </div>
        },
        {
            key: ModalType.ToBD,
            label: "Tổ bảo đảm kỹ thuật cơ động",
            children: <div className="bg-[#F5F5F6] h-svh">
                <TechnicalAssuranceTeam type={ModalType.ToBD} />
            </div>
        },
        {
            key: ModalType.TrCQDT,
            label: "Trạm cáp quang đường trục",
            children: <div className="bg-[#F5F5F6] h-svh">
                <TechnicalAssuranceTeam type={ModalType.TrCQDT} />
            </div>
        },
    ], [])
    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
            params.set('tab', tab);
            navigate({ search: params.toString() });
        }
    }, [tab]);


    return (
        <Space {...SPACE_PROP_DEFAULT}>
            <PageName title="QUẢN LÝ CƠ SỞ KỸ THUẬT" />
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
                    <div className="container">
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