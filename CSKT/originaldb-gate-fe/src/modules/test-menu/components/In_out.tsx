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
// import TTBAction from "./QLTTBModal";
import In_OutCreate from "./in_outModal";
import { TTBData } from "../types/TTB.type";
import { getHandover, metaHandover, getTTBHandoverReceived,getReceivedTTBList } from "../stores/In_out.action";
import { handoverData } from "../types/handover.type";

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
    const [meta1, setMeta1] = useState<IMeta>({ count: 0 });

    const [filter, setFilter] = useState<any>({});
    const [filterHandover, setFilterHandover] = useState<any>({});
    const [title, setTitle] = useState<string | null>(null)
    const [open, setOpen] = useState(true);
    const { userInfo } = userStore()
    const [organizations, setOrganizations] = useState<any>([]);
    const [places, setPlaces] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [datasource, setDatasource] = useState<PersonalIdentify[]>([])
    const [datasource1, setDatasource1] = useState<PersonalIdentify[]>([])
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
                    // console.log('record: ', record)
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
                title: "Nhóm TTB",
                dataIndex: "group_id",
                key: "group_id",
                render: (value: any, record: any) => record?.group_id?.name ?? '',
            },

            {

                title: "Trạng thái",
                dataIndex: "is_enable",
                key: "is_enable",
                render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>

            },
        ];
    }, []);
    const columns1: any[] = useMemo(() => {
        return [
            {
                title: "Mã biên bản",
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
                title: "Thời gian",
                dataIndex: "time",
                key: "time",
                render: (value: any) => {
                    if (!value) return "";
                    const date = new Date(value);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const hours = String(date.getHours()).padStart(2, "0");
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                    const seconds = String(date.getSeconds()).padStart(2, "0");

                    return `${day}-${month}-${year} /${hours}:${minutes}:${seconds}`;
                },
            },

            {
                title: "Giao/Nhận",
                dataIndex: "type_handover",
                key: "  type_handover",
                render: (value: any) => {
                    return value
                },
            },
            {
                title: "Đơn vị nhận",
                dataIndex: "org_receive_id",
                key: "org_receive_id",
                render: (value: any, record: any) => record?.org_receive_id?.name ?? '',
            },
            {
                title: "Đơn vị giao",
                dataIndex: "org_delivery_id",
                key: "org_delivery_id",
                render: (value: any, record: any) => record?.org_delivery_id?.name ?? '',

            },

        ];
    }, []);


    const handleActions = (key: Action, item: TTBData) => {
        switch (key) {
            case Action.View:
                openModal(
                    <In_OutCreate detail={item} action={Action.View} />,
                    {
                        width: '50vw',
                        onModalClose(res) {
                            if (res?.success) {
                                if (res?.success) {
                                    openModal(
                                        <In_OutCreate detail={item} action={Action.Update} />,
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
                    <In_OutCreate action={Action.Create} />,
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
            fetchData(pagination.page, pagination.pageSize, filter, filterHandover)
        } catch (error: any) {
            console.log('error: ', error)
        }
    }

    const fetchData = async (
        page: number,
        pageSize: number,
        filter: any,
        filterHandover: any,
    ) => {
        setIsLoading(true);
        try {

            const response: any = await Promise.all([
                getOrganizationTree(),
                // metaUsers({ ...init_filter }),
                // getUsersList({ limit: pageSize, page }, { ...init_filter }),
                getCommonCategory('species_categories'),
                getCommonCategory('nhom_TBKT'),
                // getCommonCategory('vi_tri'),
                // getPlaceTree()
                // getTTBHandoverReceived({ limit: pageSize, page }, filter),

                
            ]);
            const res = await Promise.all([
                getTTB({ limit: pageSize, page }, filter),
                metaTTB(filter),
                getHandover({ limit: pageSize, page }, filterHandover),
                metaHandover(filterHandover),
                getReceivedTTBList()

            ]);

            setOrganizations(response[0]);
            setMeta(res[1]);
            // setDatasource(res[0]);
            setDatasource(res[4]);

            setMeta1(res[3]);
            setDatasource1(res[2]);
            setCommonCategories({
                species: response[1],
                group: response[2],
                // role: role
            })
            // setPlaces(response[3])
            console.log('kiem tra: ', res[4])

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
        fetchData(pagination.page, pagination.pageSize, filter, filterHandover)
    }, [pagination, filter, filterHandover])
    const formValueChange = async () => {
        let filterValue: any = { _and: [] };

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

    };
    const formValueChange1 = async () => {
        let filterValue: any = { _and: [] };
        // let filterHandoverValue: any = {};


        if (form.getFieldValue('type_handover')?.length) {
            filterValue = {
                _and: [
                    ...filterValue._and,
                    {
                        type_handover: {
                            _in: form.getFieldValue('type_handover'),
                        }
                    },
                ],
            };
        }


        if (form.getFieldValue('org_delivery_id')?.length) {
            filterValue = {
                _and: [
                    ...filterValue._and,
                    {
                        org_delivery_id: {
                            _in: form.getFieldValue('org_delivery_id'),
                        }
                    },
                ],
            };
        }

        // if (form.getFieldValue('org_id')?.length) {
        //     filterHandoverValue = {
        //         _and: [
        //             ...filterValue._and,
        //             {
        //                 org_receive_id: {
        //                     _in: form.getFieldValue('org_id'),
        //                 }
        //             },
        //         ],
        //     };
        // }
        if (form.getFieldValue('time')?.length === 2) {
            const [startTime, endTime] = form.getFieldValue('time');
            filterValue = {
                _and: [
                    ...filterValue._and,
                    {
                        time: {
                            _gte: startTime,
                            _lte: endTime,
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
        // setFilter(filterValue);
        setFilterHandover(filterValue)
    };
    const ManagementOptions: any = [
        {
            title: "Giao",
            key: "Giao",
        },
        {
            title: "Nhận",
            key: "Nhận",
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
                        {/* <div className="text-nowrap text-base font-medium leading-[26px]">{`Danh sách cán bộ ${renderOrganizationName(title)}`}</div> */}
                        <DatePicker.RangePicker
                            size="small"
                            onChange={(dates) => {
                                if (dates && dates.length === 2 && dates[0] && dates[1]) {
                                    form.setFieldsValue({
                                        time: [dates[0].startOf('day'), dates[1].endOf('day')]
                                    });
                                } else {
                                    form.setFieldsValue({ time: null });
                                }
                                formValueChange1();
                            }}
                        />


                        <TreeSelect
                            multiple
                            showCheckedStrategy="SHOW_ALL"
                            treeCheckable
                            size="small"
                            showSearch
                            className="min-w-[200px] max-w-[300px]"
                            filterTreeNode={(input: any, treeNode: any) => {
                                return (
                                    treeNode.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                );
                            }}
                            // className="-mt-3"
                            // style={{ width: "100%" }}
                            placeholder="Chọn đơn vị"
                            allowClear
                            treeDefaultExpandAll
                            // treeData={organizationTree}
                            treeData={listToTree(arrayToTree([...organizations], { dataField: null }))}
                            onChange={(checkedValues) => {
                                form.setFieldsValue({
                                    org_id: checkedValues,
                                    // org_delivery_id: checkedValues,
                                    // org_receive_id: checkedValues,
                                });
                                formValueChange();
                                form.setFieldsValue({
                                    org_delivery_id: checkedValues,
                                    org_receive_id: checkedValues,
                                });
                                formValueChange1();
                            }}
                            // onSelect={() => {
                            //     // Cập nhật org_delivery_id và org_receive_id, gọi formValueChange1()
                            //     form.setFieldsValue({
                            //         org_delivery_id: form.getFieldValue('org_id'),
                            //         org_receive_id: form.getFieldValue('org_id'),
                            //     });
                            //     formValueChange1();
                            // }}
                        />
                        {/* <div className="flex flex-row items-center min-w-200 gap-2"> */}
                        <div className="flex flex-row items-center min-w-200 gap-2">
                            <Input
                                size="small"
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
                                        setFilterHandover((prev: any) => ({
                                            ...prev,
                                            name: {
                                                _contains: e.target.value,
                                            },
                                        }));
                                    } else {
                                        const { name, ...filterWithoutFullName } = filter;
                                        setFilter(filterWithoutFullName);

                                        setFilterHandover(filterWithoutFullName)
                                    }
                                }}
                                suffix={<SearchOutlined className="text-primary" />}
                            />
                            <Button
                                size="small"
                                onClick={() => {
                                    openModal(
                                        <In_OutCreate action={Action.Create} />,
                                        {
                                            width: '80vw',
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

                    <Splitter
                        style={{
                            height: 520,
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Splitter.Panel collapsible>
                            <div className="flex flex-row flex-wrap items-center justify-between pb-2 gap-4">
                                <div className="text-base font-medium leading-[26px] whitespace-nowrap">
                                    {`Danh sách biên bản bàn giao ${renderOrganizationName(title)}`}
                                </div>
                                <div className="flex flex-row flex-wrap gap-4 items-center">

                                    <Checkbox.Group
                                        onChange={(checkedValues) => {
                                            form.setFieldsValue({ type_handover: checkedValues });
                                            formValueChange1();
                                        }}
                                        style={{ width: "100%" }}
                                    // className="flex flex-col"
                                    >
                                        {ManagementOptions?.map(
                                            (data: { title: string; key: string }, index: number) => (
                                                <Col className="mt-[10px]">
                                                    <Checkbox value={data.key}>
                                                        <span className="text-[14px] font-normal leading-[23px]">
                                                            {data.title}
                                                        </span>
                                                    </Checkbox>
                                                </Col>
                                            )
                                        )}
                                    </Checkbox.Group>
                                </div>
                            </div>
                            <BaseTable
                                loading={isLoading}
                                columns={columns1}
                                dataSource={datasource1}
                                setPagination={setPagination}
                                rowKey={"id"}
                                actionClick={handleActions}
                                x={800}
                                onChange={({ current, pageSize }: any) => {
                                    setPagination({ page: current, pageSize });
                                    fetchData(current, pageSize, filter, filterHandover);
                                }}
                                paginationCustom={
                                    {
                                        current: pagination.page,
                                        pageSize: pagination.pageSize,
                                        total: meta1?.count || 0
                                    }
                                }
                            />
                        </Splitter.Panel>
                        <Splitter.Panel
                            collapsible={{
                                start: true,
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div className="text-nowrap text-base font-medium leading-[26px]">
                                    {`Danh sách trang bị nhận bàn giao ${renderOrganizationName(title)}`}
                                </div>
                            </div>
                            <BaseTable
                                loading={isLoading}
                                columns={columns}
                                dataSource={datasource}
                                setPagination={setPagination}
                                rowKey={"id"}
                                actionClick={handleActions}
                                x={1400}
                                onChange={({ current, pageSize }: any) => {
                                    setPagination({ page: current, pageSize });
                                    fetchData(current, pageSize, filter, filterHandover);
                                }}
                                paginationCustom={
                                    {
                                        current: pagination.page,
                                        pageSize: pagination.pageSize,
                                        total: meta?.count || 0
                                    }
                                }
                            />
                        </Splitter.Panel>
                        <Splitter.Panel collapsible >
                            <div style={{ textAlign: 'center' }}>
                                <div className="text-nowrap text-base font-medium leading-[26px]">
                                    {`Danh sách trang bị đã bàn giao ${renderOrganizationName(title)}`}
                                </div>
                            </div>

                            <BaseTable
                                loading={isLoading}
                                columns={columns}
                                dataSource={datasource}
                                setPagination={setPagination}
                                rowKey={"id"}
                                actionClick={handleActions}
                                x={1400}
                                onChange={({ current, pageSize }: any) => {
                                    setPagination({ page: current, pageSize });
                                    fetchData(current, pageSize, filter, filterHandover);
                                }}
                                paginationCustom={
                                    {
                                        current: pagination.page,
                                        pageSize: pagination.pageSize,
                                        total: meta?.count || 0
                                    }
                                }
                            />
                        </Splitter.Panel>
                    </Splitter>
                </div>
            </div>

        </div>
    );
};
export default In_OutManagement;
