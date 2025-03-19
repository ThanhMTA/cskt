import { Action, LayoutSpace, Status, StatusUser } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import BaseTable from "@app/components/BaseTable";
import { Organizations, PersonalIdentify } from "@app/types/types";
import { ITableAction } from "@app/interfaces/table.interface";
import { FilterFilled, MenuFoldOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { ACCOUNT_TYPE } from "../enum/Account.enum";
import { Badge, Button, Form, Splitter, Input, Col, Row, Tag, Tooltip, TreeSelect, Checkbox, Select, DatePicker, Space } from "antd";
import { arrayToTree } from "performant-array-to-tree";
import { listToTree } from "@app/core/helper";
import { getUsersList, metaUsers, getOrganizationTree } from "../stores/Account.action";
import { getTTB, metaTTB, getCommonCategory, getPlaceTree } from "../stores/QLTTB.action";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import dayjs from "dayjs";
import { userStore } from "@app/store/user/user.store";
import { Role } from "../enum/Role.enum";
import { IMeta } from "@app/interfaces/common.interface";
import { useModal } from "@app/contexts/ModalContext";
// import TTBAction from "./QLTTBModal";
import { ic_geo } from "@app/assets/svg";
import { group } from "console";
import TTBAction from "./QLTTBModal";
import { TTBData } from "../types/TTB.type";

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
interface ICommonCategory {
    species: any[],
    group: any[],
    // position: any[],
}
const In_OutManagement: React.FC = () => {
    const [form] = Form.useForm();
    const { openModal } = useModal();
    const [meta, setMeta] = useState<IMeta>({ count: 0 });
    const [filter, setFilter] = useState<any>({});
    const [title, setTitle] = useState<string | null>(null)
    const [open, setOpen] = useState(true);
    const { userInfo } = userStore()
    const [organizations, setOrganizations] = useState<any>([]);
    const [places, setPlaces] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [datasource, setDatasource] = useState<PersonalIdentify[]>([])
    const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
    const toggleOpen = () => {
        setOpen(!open);
    };
    const [filterLevel, setFilterLevel] = useState<any>({})
    const [commonCategories, setCommonCategories] = useState<ICommonCategory>({
        species: [],
        group: [],
        // position: [],
    });
    const columns: any[] = useMemo(() => {
        return [
            {
                title: "Tên trang bị",
                dataIndex: "name",
                fixed: 'left',
                key: TableGeneralKeys.Name,
                render: (value: string, record: any) => {
                    console.log('record: ', record)
                    return (
                        <span
                            className="font-semibold text-sm cursor-pointer text-[#3D73D0]"
                            onClick={() => handleActions(Action.View, record)}
                        >
                            {value ?? ""}
                        </span>
                    );
                },
            },
            {
                title: "Ký hiệu",
                dataIndex: "nick_name",
                key: "nick_name",
                render: (value: any) => {
                    return value
                },
                //     width:150

            },
            {
                title: "serial number",
                dataIndex: "serial_number",
                render: (value: any) => {
                    return value
                },
            },
            {
                title: "Đơn vị tính",
                dataIndex: "unit_id",
                key: "unit_id",
                render: (value: any, record: any) => record?.unit_id?.name ?? '',
            },
            {
                title: "Đơn vị biên chế",
                dataIndex: "org_id",
                key: "org_id",
                render: (value: any, record: any) => record?.org_id?.name ?? '',
            },
            {
                title: "số lượng",
                dataIndex: "quantity",
                key: "quantity",
                render: (value: any) => {
                    return value
                },

            },
            {
                title: "Tình trạng",
                dataIndex: "condition_id",
                key: "condition_id",
                render: (value: any, record: any) => record?.condition_id?.name ?? '',
            },
            {
                title: "Chủng loại",
                dataIndex: "species_id",
                key: "species_id",
                render: (value: any, record: any) => record?.species_id?.name ?? '',
            },
            {
                title: "Nhóm trang thiết bị",
                dataIndex: "group_id",
                key: "group_id",
                render: (value: any, record: any) => record?.group_id?.name ?? '',
            },
            {
                title: "Nguồn đầu tư",
                dataIndex: "investor_id",
                key: "investor_id",
                render: (value: any, record: any) => record?.investor_id?.name ?? '',
            },
            {
                title: "Hãng sản xuất",
                dataIndex: "manufacturer_id",
                key: "manufacturer_id",
                render: (value: any, record: any) => record?.manufacturer_id?.name ?? '',
            },
            {
                title: "Người quản lý",
                dataIndex: "manager_id",
                key: "manager_id",
                render: (value: any, record: any) => record?.manager_id?.name ?? '',
            },
            {
                title: "Vị trí hiện tại",
                dataIndex: "place_id",
                key: "place_id",
                render: (value: any, record: any) => record?.place_id?.name ?? '',
            },
            {

                title: "Trạng thái",
                dataIndex: "is_enable",
                key: "is_enable",
                render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>

            },
        ];
    }, []);

    const handleActions = (key: Action, item: TTBData) => {
        switch (key) {
            case Action.View:
                openModal(
                    <TTBAction id={item.id} action={Action.View} />,
                    {
                        width: '50vw',
                        onModalClose(res) {
                            if (res?.success) {
                                if (res?.success) {
                                    openModal(
                                        <TTBAction id={item.id} action={Action.Update} />,
                                        {
                                            width: '50vw',
                                            onModalClose() {
                                                reloadData()
                                            },
                                        }
                                    )
                                } else {
                                    reloadData();
                                }
                            }
                        },
                    }
                )
                break;
            case Action.Create:
                openModal(
                    <TTBAction action={Action.Create} />,
                    {
                        width: '50vw',
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
            // let init_filter = {};
            // switch (userInfo?.role?.name) {
            //     case Role.ADMIN:
            //         init_filter = {
            //             status: {
            //                 _in: [StatusUser.active, StatusUser.draft]
            //             }
            //         };
            //         break;
            //     default:
            //         init_filter = {
            //             status: {
            //                 _in: [StatusUser.active]
            //             }
            //         };
            //         break;
            // }
            // if (Object.keys(filter).length !== 0) {
            //     init_filter = {
            //         personal_id: filter,
            //         ...init_filter
            //     }
            // }
            // const res = await Promise.all([getTTB({ limit: pageSize, page }, filter), metaCanBo(filter)]);

            const response: any = await Promise.all([
                getOrganizationTree(),
                // metaUsers({ ...init_filter }),
                // getUsersList({ limit: pageSize, page }, { ...init_filter }),
                getCommonCategory('species_categories'),
                getCommonCategory('nhom_TBKT'),
                // getCommonCategory('vi_tri'),
                // getPlaceTree()
            ]);
            const res = await Promise.all([getTTB({ limit: pageSize, page }, filter), metaTTB(filter)]);

            setOrganizations(response[0]);
            setMeta(res[1]);
            setDatasource(res[0])
            setCommonCategories({
                species: response[1],
                group: response[2],
                // role: role
            })
            // setPlaces(response[3])
            // console.log('data: ', response[3])

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
    const formValueChange = async () => {
        let filterValue: any = { _and: [] };
        let filterLevel: any = {};
        if (form.getFieldValue('level')?.length) {
            filterLevel = {
                level: {
                    _in: form.getFieldValue('level'),
                }
            };
        }
        if (form.getFieldValue('geo')?.length) {
            filterValue = {
                _and: [
                    ...filterValue._and,
                    {
                        ward_id: {
                            district_id: {
                                province_id: {
                                    region_id: {
                                        _in: form.getFieldValue('geo'),
                                    }
                                }
                            }
                        },
                    },
                ],
            };
        }
        if (form.getFieldValue('group_id')?.length) {
            filterValue = {
                _and: [
                    ...filterValue._and,
                    {
                        group_id: {
                            _in: form.getFieldValue('group_id'),
                        }
                    },
                ],
            };
        }
        if (form.getFieldValue('species_id')?.length) {
            filterValue = {
                _and: [
                    ...filterValue._and,
                    {
                        species_id: {
                            _in: form.getFieldValue('species_id'),
                        }
                    },
                ],
            };
        }
        if (form.getFieldValue('org_id')?.length) {
            filterValue = {
                _and: [
                    ...filterValue._and,
                    {
                        org_id: {
                            _in: form.getFieldValue('org_id'),
                        }
                    },
                ],
            };
        }
        if (form.getFieldValue('place_id')?.length) {
            filterValue = {
                _and: [
                    ...filterValue._and,
                    {
                        place_id: {
                            _in: form.getFieldValue('place_id'),
                        }
                    },
                ],
            };
        }
        if (form.getFieldValue('search')?.length) {
            filterValue = {
                _and: [
                    ...filterValue._and,
                    {
                        name: {
                            _icontains: form.getFieldValue('search').trim(),
                        }
                    },
                ],
            };
        }
        setFilter(filterValue);
        setFilterLevel(filterLevel)
    };
    const ManagementOptions: any = [
        {
            title: "Ban truyền dẫn quang",
            key: "TQD",
        },
        {
            title: "Ban Visat",
            key: "visat",
        },

    ];
    const In_OutOptions: any = [
        {
            title: "Nhận trang thiết bị",
            key: "in",
        },
        {
            title: "Bàn giao trang thiết bị",
            key: "out",
        },

    ];
    return (
        <div
            // thêm w-[1180px] để sửa lại kích thước của phần nội dung, p-3 để cách lề dưới
            className="overflow-hidden rounded-lg bg-white w-[1180px]  "
        // style={{ height: `calc(100vh - ${LayoutSpace.SectionMargin}px)` }}
        >
            <div className="flex gap-4 p-4" style={{ height: `calc(100% - ${LayoutSpace.TabMargin}px)`, }}>

                {/* max-w-[870px]==> để chỉnh sửa kích thước */}
                <div className=" flex flex-col w-full min-w-0  overflow-hidden">
                    <div className="flex flex-row pb-2 items-center justify-between">
                        {/* <div className="flex flex-row  items-center "> */}

                        <div className="text-nowrap text-base font-medium leading-[26px]">{`Danh sách cán bộ ${renderOrganizationName(title)}`}</div>
                        {/* <div className="flex flex-row items-center min-w-200 gap-2"> */}
                        <div className="flex flex-row items-center min-w-200 gap-2">

                            <Input
                                className="rounded-full"
                                placeholder="Nhập tên trang thiết bị"
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
                                    <TTBAction action={Action.Create} />,
                                    {
                                        width: '50vw',
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
                    <Row>
                        <Col span={14} push={10}>
                            <BaseTable
                                loading={isLoading}
                                columns={columns}
                                dataSource={datasource}
                                setPagination={setPagination}
                                rowKey={"id"}
                                actionClick={handleActions}


                                x={2500}



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
                        </Col>
                        <Col span={10} pull={14}  style={{ paddingLeft: '16px' }}>
                            <BaseTable
                                loading={isLoading}
                                columns={columns}
                                dataSource={datasource}
                                setPagination={setPagination}
                                rowKey={"id"}
                                actionClick={handleActions}


                                x={2500}



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
                        </Col>
                    </Row>


                </div>
            </div>

        </div>
    );
};
export default In_OutManagement;
