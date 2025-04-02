import { LayoutSpace } from "@app/enums";
import { ACTIVITY_ACTION, ACTIVITY_TYPE } from "../enum/Activity.enum";
import { Badge, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import BaseTable from "@app/components/BaseTable";
import dayjs from "dayjs";
import { CheckOutlined, CloseOutlined, FilterFilled, HistoryOutlined, LoginOutlined, LogoutOutlined, MenuFoldOutlined, PlusOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import { getListHistories, metaHistory } from "../stores/Activity.action"
import { IMeta } from "@app/interfaces/common.interface";

const FILTER_MENU = [
    {
        key: '0',
        name: 'Tất cả',
        value: 'all',
        icon: <HistoryOutlined />
    },
    {
        key: '1',
        name: 'Thêm mới',
        value: 'create',
        icon: <PlusOutlined />
    },
    {
        key: '2',
        name: 'Sửa',
        value: 'update',
        icon: <CheckOutlined />
    },
    {
        key: '3',
        name: 'Xoá',
        value: 'delete',
        icon: <CloseOutlined />
    },
    {
        key: '4',
        name: 'Đăng nhập',
        value: 'login',
        icon: <LoginOutlined />
    },
    {
        key: '5',
        name: 'Đăng xuất',
        value: 'logout',
        icon: <LogoutOutlined />
    },
]
const ActivityManagement: React.FC = () => {
    const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
    const [open, setOpen] = useState(true);
    const [filter, setFilter] = useState<any>({})
    const [histories, setHistories] = useState<any[]>([])
    const [meta, setMeta] = useState<IMeta>({ count: 0 });
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const toggleOpen = () => {
        setOpen(!open);
    };

    const columns: any[] = useMemo(() => {
        return [
            {
                title: "Hành động",
                dataIndex: ACTIVITY_TYPE['ACTION'],
                key: ACTIVITY_TYPE['ACTION'],
                render: (value: string) => ACTIVITY_ACTION[value]
            },
            {
                title: "Dữ liệu",
                dataIndex: ACTIVITY_TYPE['COLLECTION'],
                key: ACTIVITY_TYPE['COLLECTION'],
            },
            {
                title: "Thời gian",
                dataIndex: ACTIVITY_TYPE['ACTION_AT'],
                key: ACTIVITY_TYPE['ACTION_AT'],
                render: (value: string) => dayjs(value).format('HH:MM DD/MM/YYYY')
            },
            {
                title: "Cán bộ",
                dataIndex: ACTIVITY_TYPE['ACTION_BY'],
                key: ACTIVITY_TYPE['ACTION_BY'],
                render: (value: { first_name: string, last_name: string }) => `${value?.first_name} ${value?.last_name}`
            },
            {
                title: "Thông tin truy cập",
                dataIndex: ACTIVITY_TYPE['AGENT'],
                key: ACTIVITY_TYPE['AGENT'],
                width: '40%',
                render: (revisions: any) => {
                    const data = revisions?.[0]?.data;
                    if (!data) return "";
                    const jsonData = JSON.stringify(data);
                    const truncated = jsonData.length > 50 ? `${jsonData.slice(0, 70)}...` : jsonData;
                    return <span title={jsonData}>{truncated}</span>;
                }
            },
            {
                title: "Địa chỉ IP",
                dataIndex: ACTIVITY_TYPE['IP_ADRESS'],
                key: ACTIVITY_TYPE['IP_ADRESS']
            }
        ];
    }, []);

    const fetchData = async (
        page: number,
        pageSize: number,
        filter: any
    ) => {
        setIsLoading(true)
        try {
            const histories = await getListHistories({ limit: pageSize, page }, filter);
            const meta = await metaHistory(filter)
            setHistories(histories);
            setMeta(meta)
        } catch (error) {
            console.log('error: ', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData(pagination.page, pagination.pageSize, filter)
    }, [pagination, filter])

    return (
        <div
            className="overflow-hidden rounded-lg bg-white"
            style={{ height: `calc(100vh - ${LayoutSpace.SectionMargin}px)` }}
        >
            <div className="flex gap-4 p-4" style={{ height: `calc(100% - ${LayoutSpace.TabMargin}px)` }}>
                <div
                    className={`transition-all duration-300 ${open ? "w-[268px]" : "w-16 border"
                        } approval-filter-container flex max-h-full flex-col rounded-lg bg-white`}
                >
                    <div
                        className={`flex items-center px-4 py-2 ${open ? "justify-between rounded-t-lg border" : "justify-center"
                            }`}
                    >
                        <h3
                            className={`${open ? "block" : "hidden"} text-nowrap text-base font-medium leading-[26px]`}
                        >
                            Bộ lọc tìm kiếm
                        </h3>
                        <div className="flex flex-row gap-2">
                            <Tooltip title="Làm mới bộ lọc">
                                <button className="m-0 p-0" onClick={() => { setFilter({}) }}>
                                    <RedoOutlined />
                                </button>
                            </Tooltip>
                            <button onClick={toggleOpen}>
                                <Badge color="#0074D6" count={0} className="scale-[80%] text-xl">
                                    {open ? <MenuFoldOutlined /> : <FilterFilled className="text-[#8C9093]" />}
                                </Badge>
                            </button>
                        </div>
                    </div>
                    <div
                        className={`${open ? "block w-[268px]" : "hidden"
                            } flex-1 overflow-auto rounded-b-lg border border-t-0 p-4`}
                    >
                        <div className="flex flex-col -mt-3">
                            {FILTER_MENU.map((item: any) => (
                                <div className="flex flex-col">
                                    <div
                                        className="flex flex-row py-2 px-1 hover:bg-secondary my-1 rounded-sm cursor-pointer"
                                        onClick={() => {
                                            if (item?.value === 'all') {
                                                setFilter({})
                                            } else {
                                                setFilter({
                                                    action: {
                                                        _eq: item?.value
                                                    }
                                                })
                                            }
                                        }}
                                    >
                                        {item?.icon}
                                        <div className="mx-2">{item?.name}</div>
                                    </div>
                                    {item?.key === '0' &&
                                        <div className="flex bg-black border-t my-1" />}
                                </div>

                            ))}
                        </div>
                    </div>

                </div>
                <div className="flex-1 overflow-auto">
                    <BaseTable
                        loading={isLoading}
                        columns={columns}
                        dataSource={histories}
                        setPagination={setPagination}
                        onChange={({ current, pageSize }: any) => {
                            setPagination({ page: current, pageSize });
                            fetchData(current, pageSize, filter);
                        }}
                        paginationCustom={
                            {
                                current: pagination.page,
                                pageSize: pagination.pageSize,
                                total: meta?.count || 0
                            }
                        }
                        rowKey={"id"}
                        scroll={undefined}
                    />
                </div>
            </div>
        </div>
    );
};

export default ActivityManagement;
