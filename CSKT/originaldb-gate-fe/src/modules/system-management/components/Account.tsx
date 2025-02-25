import { Action, LayoutSpace, Status, StatusUser } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import BaseTable from "@app/components/BaseTable";
import { Organizations, PersonalIdentify } from "@app/types/types";
import { ITableAction } from "@app/interfaces/table.interface";
import { FilterFilled, MenuFoldOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { ACCOUNT_TYPE } from "../enum/Account.enum";
import { Badge, Button, Form, Input, Tag, Tooltip, TreeSelect } from "antd";
import { arrayToTree } from "performant-array-to-tree";
import { listToTree } from "@app/core/helper";
import { getUsersList, metaUsers, getOrganizationTree } from "../stores/Account.action";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import dayjs from "dayjs";
import { userStore } from "@app/store/user/user.store";
import { Role } from "../enum/Role.enum";
import { IMeta } from "@app/interfaces/common.interface";
import { useModal } from "@app/contexts/ModalContext";
import AccountDrawer from "./AccountModal";

export const ACTION_TABLE: ITableAction[] = [];
const COLOR_RANGE: any = {
    draft: 'red',
    active: 'green'
}
const tagInputStyle: React.CSSProperties = {
    height: 30,
    justifyItems: 'center',
    alignItems: 'center'
};
const AccountManagement: React.FC = () => {
    const [form] = Form.useForm();
    const { openModal } = useModal();
    const [meta, setMeta] = useState<IMeta>({ count: 0 });
    const [filter, setFilter] = useState<any>({});
    const [title, setTitle] = useState<string | null>(null)
    const [open, setOpen] = useState(true);
    const { userInfo } = userStore()
    const [organizations, setOrganizations] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [datasource, setDatasource] = useState<PersonalIdentify[]>([])
    const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
    const toggleOpen = () => {
        setOpen(!open);
    };

    const columns: any[] = useMemo(() => {
        return [
            {
                title: "Họ và tên",
                dataIndex: ACCOUNT_TYPE['FULL_NAME'],
                key: ACCOUNT_TYPE['FULL_NAME'],
                render: (value: string, record: any) => {
                    console.log('record: ', record)
                    return (
                        <span
                            className="font-semibold text-sm cursor-pointer text-[#3D73D0]"
                            onClick={() => handleActions(Action.View, record)}
                        >
                            {record?.personal_id?.name ?? ''}
                        </span>
                    );
                },
            },
            {
                title: "Email",
                dataIndex: ACCOUNT_TYPE['EMAIL'],
                key: ACCOUNT_TYPE['EMAIL'],
                render: (value: any) => {
                    return value
                }
            },
            {
                title: "Cấp bậc",
                dataIndex: ACCOUNT_TYPE['RANK'],
                key: ACCOUNT_TYPE['RANK'],
                render: (value: any, record: any) => record?.personal_id?.rank_id?.name ?? '',
            },
            {
                title: "Chức vụ",
                dataIndex: ACCOUNT_TYPE['POSITION'],
                key: ACCOUNT_TYPE['POSITION'],
                render: (value: any, record: any) => record?.personal_id?.position_id?.name ?? '',
            },
            {
                title: "Đơn vị",
                dataIndex: ACCOUNT_TYPE['ORGANIZATION'],
                key: ACCOUNT_TYPE['ORGANIZATION'],
                render: (value: any, record: any) => record?.personal_id?.org_id?.name ?? '',
            },
            {
                title: "Số điện thoại",
                dataIndex: ACCOUNT_TYPE['PHONE_NUMBER'],
                key: ACCOUNT_TYPE['PHONE_NUMBER'],
                render: (value: any, record: any) => record?.personal_id?.phone_number ?? '',

            },
            {
                title: "Ngày sinh",
                dataIndex: ACCOUNT_TYPE['DOB'],
                key: ACCOUNT_TYPE['DOB'],
                render: (value: any, record: any) => record?.personal_id?.birthday ? dayjs(record?.personal_id?.birthday).format('DD/MM/YYYY') : ''
            },
            {
                title: "Trạng thái",
                dataIndex: ACCOUNT_TYPE['STATUS'],
                key: ACCOUNT_TYPE['STATUS'],
                render: (value: any) => {
                    return (
                        Status[value] ? <Tag style={tagInputStyle} color={COLOR_RANGE[value]}>{Status[value]}</Tag> : <Tag style={tagInputStyle}>{'Chưa kích hoạt'}</Tag>
                    )
                }
            },
        ];
    }, []);

    const handleActions = (key: Action, item?: any) => {
        switch (key) {
            case Action.View:
                openModal(
                    <AccountDrawer detail={item} action={Action.Update} />,
                    {
                        width: '40vw',
                        onModalClose(res) {
                            if (res?.success) {
                                reloadData()
                            }
                        },
                    }
                )
                break;
            case Action.Create:
                openModal(
                    <AccountDrawer action={Action.Create} />,
                    {
                        width: '40vw',
                        onModalClose(res) {
                            if (res?.success) {
                                setTimeout(() => reloadData(), 10000);
                            }
                        },
                    }
                )
                break;
        }
    };

    const reloadData = async () => {
        try {
            fetchData(pagination.page, pagination.pageSize, filter)
        } catch (error: any) {
            console.log('error: ', error)
        }
    }

    const fetchData = async (
        page: number,
        pageSize: number,
        filter: any
    ) => {
        setIsLoading(true);
        try {
            let init_filter = {};
            switch (userInfo?.role?.name) {
                case Role.ADMIN:
                    init_filter = {
                        status: {
                            _in: [StatusUser.active, StatusUser.draft]
                        }
                    };
                    break;
                default:
                    init_filter = {
                        status: {
                            _in: [StatusUser.active]
                        }
                    };
                    break;
            }
            if (Object.keys(filter).length !== 0) {
                init_filter = {
                    personal_id: filter,
                    ...init_filter
                }
            }

            const response: any = await Promise.all([
                getOrganizationTree(),
                metaUsers({ ...init_filter }),
                getUsersList({ limit: pageSize, page }, { ...init_filter })
            ]);
            setOrganizations(response[0]);
            setMeta(response[1]);
            setDatasource(response[2])
        } catch (error) {
            console.log('error: ', error)
        } finally {
            setIsLoading(false)
        }
    }

    const renderOrganizationName = (id: string | null) => {
        if (id) {
            return ` - ${organizations?.find((item: Organizations) => item?.id === id)?.name}`
        }
        return ''
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
                            Danh sách đơn vị
                        </h3>
                        <div className="flex flex-row gap-2">
                            <Tooltip title="Làm mới bộ lọc">
                                <button className="m-0 p-0" onClick={() => {
                                    handleActions(Action.Create)
                                }}>
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
                        <Form
                            form={form}
                            layout="vertical"
                            onValuesChange={(e: any) => {
                                setPagination({ page: 1, pageSize: DEFAULT_PAGESIZE });
                                if (e.org_id) {
                                    setTitle(e.org_id)
                                    setFilter((prev: any) => ({
                                        ...prev,
                                        org_id: {
                                            _eq: e.org_id,
                                        },
                                    }));
                                } else {
                                    const { org_id, ...filterWithoutOrg } = filter;
                                    setFilter(filterWithoutOrg)
                                    setTitle(null)
                                }
                            }}
                        >
                            <Form.Item name="org_id" label="" className="mb-0">
                                <TreeSelect
                                    showSearch
                                    allowClear
                                    multiple={false}
                                    treeLine
                                    filterTreeNode={(input: any, treeNode: any) => {
                                        return (
                                            treeNode.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        );
                                    }}
                                    // className="border rounded"
                                    placeholder="Tìm kiếm tên đơn vị"
                                    dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                                    treeDataSimpleMode
                                    style={{ width: "100%" }}
                                    treeDefaultExpandAll
                                    treeData={listToTree(arrayToTree([...organizations], { dataField: null }))}
                                    suffixIcon={<SearchOutlined className="text-sm text-black" />}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <div className="flex flex-row pb-2 items-center justify-between">
                        <div className="text-nowrap text-base font-medium leading-[26px]">{`Danh sách cán bộ ${renderOrganizationName(title)}`}</div>
                        <div className="flex flex-row items-center min-w-200 gap-2">
                            <Input
                                className="rounded-full"
                                placeholder="Nhập tên cán bộ"
                                allowClear
                                onChange={(e: any) => {
                                    setPagination({ page: 1, pageSize: DEFAULT_PAGESIZE });
                                    if (e.target.value !== '') {
                                        setFilter((prev: any) => ({
                                            ...prev,
                                            name: {
                                                _contains: e.target.value,
                                            },
                                        }));
                                    } else {
                                        const { name, ...filterWithoutFullName } = filter;
                                        setFilter(filterWithoutFullName)
                                    }
                                }}
                                suffix={<SearchOutlined className="text-primary" />}
                            />
                            <Button onClick={() => {
                                openModal(
                                    <AccountDrawer action={Action.Create} />,
                                    {
                                        width: '40vw',
                                        onModalClose(res) {
                                            if (res?.success) {
                                                reloadData()
                                            }
                                        },
                                    }
                                )
                            }} type="primary">
                                Thêm mới
                            </Button>
                        </div>
                    </div>
                    <BaseTable
                        loading={isLoading}
                        columns={columns}
                        dataSource={datasource}
                        setPagination={setPagination}
                        rowKey={"id"}
                        actionClick={handleActions}
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
                    />
                </div>
            </div>

        </div>
    );
};
export default AccountManagement;
