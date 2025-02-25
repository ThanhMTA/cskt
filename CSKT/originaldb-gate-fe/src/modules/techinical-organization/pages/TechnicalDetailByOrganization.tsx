import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Breadcrumb, Skeleton, Space, Tabs } from "antd";
import PageName from "@app/components/PageName";
import { LayoutSpace } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { TabsProps } from "antd/lib";
import { ModalType } from "../enum/LevelCategory.enum";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TongHopVTKTDCSC from "../components/TongHopVTKTDCSC";
import { getOrganizationsDetail } from "@app/modules/force-categories/store/Organizations.action";
import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import TechnicalAssuranceTeamByOrg from "../components/TechnicalAssuranceTeamByOrg";
import CbnvTechnicalByOrg from "../components/CbnvTechnicalByOrg";
import TongHopTechnicalByOrg from "../components/TongHopTechnicalByOrg";
export default function TechnicalDetailByOrganization() {
    const routeParams: any = useParams();
    const { id } = routeParams;
    const navigate = useNavigate();
    const location = useLocation();
    const { tab = "" } = location.state || {};
    const [loading, setLoading] = useState<boolean>(false);
    const [organization, setOrganization] = useState<OrganizationsData>()
    const [activeTab, setActiveTab] = useState<string>();
    const itemsTabs: TabsProps["items"] = useMemo(() => [
        {
            key: "1",
            label: <span className="px-1">{`${tab === ModalType.TrCQDT ? 'Danh sách Trạm CQĐT' : 'Danh sách Tổ BĐKT cơ động'}`}</span>,
            children: <div className="bg-white h-svh">
                <TechnicalAssuranceTeamByOrg type={tab} tree_path={organization?.tree_path} />
            </div>
        },
        {
            key: "2",
            label: <span className="px-1">PL1. Báo cáo tổng hợp Dụng cụ, phương tiện đo</span>,
            children: <div className="bg-white h-svh">
                <TongHopTechnicalByOrg type={tab} tree_path={organization?.tree_path} />
            </div>
        },
        {
            key: "3",
            label: <span className="px-1">PL2. Báo cáo tổng hợp CB, NVCMKT</span>,
            children: <div className="bg-white h-svh">
                <CbnvTechnicalByOrg type={tab} tree_path={organization?.tree_path} />
            </div>
        },
        {
            key: "4",
            label: <span className="px-1">PL3. Chi tiết dụng cụ, phương tiện đo</span>,
            children: <div className="bg-white h-svh">
                <TongHopVTKTDCSC />
            </div>
        },
    ], [organization])
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
                break;
        }
        return sourceTab
    }
    const handleBreadcrumbClick = (event: any) => {
        event.preventDefault();
        navigate("/quan-ly-cskt", {
            state: { tab }
        })
    };
    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await getOrganizationsDetail(id, {});
            if (!res) {
                console.log('No organization details found.');
                return;
            }
            setOrganization(res);
        } catch (error: any) {
            console.error('Error fetching data: ', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData()
    }, [id])

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
                {loading ? <Skeleton /> : (
                    <section className="-mt-3">
                        <div className="container-larger">
                            <div
                                className="rounded-lg ring-[10px]
                            ring-white/30 bg-[white] py-2 gap-4 flex-col flex">
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
                                                        title: organization?.name,
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div
                                            className="flex flex-col rounded-lg pb-0
             ring-white/30 bg-white overflow-hidden">
                                            <div className="flex mt-2 relative">
                                                <div className="w-screen">
                                                    <Tabs
                                                        className="rounded-lg pb-0
            ring-white/30 border-b border-solid border-gray-300 bg-white overflow-hidden"
                                                        activeKey={activeTab}
                                                        items={itemsTabs}
                                                        size="small"
                                                        onChange={(value: any) => {
                                                            setActiveTab(value.toString())
                                                        }}
                                                        tabBarStyle={{
                                                            background: '#F5F5F6',
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
                )}

            </section>
        </Space>
    );
}