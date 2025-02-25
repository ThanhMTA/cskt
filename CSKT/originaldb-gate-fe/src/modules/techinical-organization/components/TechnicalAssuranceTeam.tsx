import { FilterFilled, MenuFoldOutlined, MinusOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Checkbox, Col, Form, Input, Skeleton, Table, TableColumnsType, TreeSelect } from "antd";
import { Key, useEffect, useRef, useState } from "react";
import { ModalType, TechinicalType } from "../enum/LevelCategory.enum";
import { getRegion } from "@app/modules/it-categories/store/Region.action";
import { getFullAddressString, listToTree, selectMap } from "@app/core/helper";
import { getOrganizationTree } from "../stores/TechnicalOrganization.action";
import { ic_geo } from "@app/assets/svg";
import { OFFICAL } from "@app/modules/technical-categories/enums/TechnicalTeams.enum";
import TechnicalAssuranceAction from "./TechnicalAssuranceAction";
import { useModal } from "@app/contexts/ModalContext";
import { ActorRole } from "../constants/level.constant";
import { userStore } from "@app/store/user/user.store";
import { Organizations, OrgTypeCategories, WardCategories } from "@app/types/types";
import { Action } from "@app/enums";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TechnicalOrganizationData } from "../types/TechnicalOrganization.type";
import { getTechnicalTypes, metaTechnicalTypes } from "../stores/TechnicalTypes.action";
import { getTechnicalTypeList } from "../stores/TechnicalType.action";

type TechnicalAssuranceTeamType = {
    type: any;
};
const TechnicalAssuranceTeam: React.FC<TechnicalAssuranceTeamType> = ({ type }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const defaultTab = params.get('tab') ?? '';
    const modalType = useRef<ModalType>(type);
    const { openModal } = useModal();
    const { userInfo } = userStore();
    const [open, setOpen] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [geoOptions, setGeoOptions] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [data, setData] = useState<TechnicalOrganizationData[]>([]);
    const [organizationTree, setOrganizationTree] = useState<any[]>([]);
    const [organizationOptions, setOrganizationOptions] = useState<any[]>([]);
    const [technicalId, setTechnicalId] = useState<string | undefined>()
    const [filter, setFilter] = useState<any>({ _and: [] });
    const [filterLevel, setFilterLevel] = useState<any>({});
    const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
    const [form] = Form.useForm();
    const columns: TableColumnsType<any> = [
        {
            title: <span className="font-bold">{"Tên"}</span>,
            dataIndex: "name",
            width: '40%',
            render: (value: any, record: any) => {
                if (record?.major_id === undefined && record?.ward_id === undefined) {
                    return (
                        <Link
                            className="cursor-pointer text-[#3D73D0]"
                            to={`/quan-ly-cskt/tong-hop-vtkt-dcsc/${record?.id}`}
                            onClick={(event) => {
                                event.preventDefault();
                                navigate(`/quan-ly-cskt/tong-hop-vtkt-dcsc/${record?.id}`, {
                                    state: {
                                        tab: defaultTab
                                    }
                                })
                            }}
                        >
                            {value ?? ""}
                        </Link >
                    )
                }
                return (
                    <Link
                        className="cursor-pointer text-[#3D73D0]"
                        to={`/quan-ly-cskt/${record?.id}`}
                        onClick={(event) => {
                            event.preventDefault();
                            navigate(`/quan-ly-cskt/${record?.id}`, {
                                state: {
                                    tab: defaultTab,
                                    name: record?.name
                                }
                            })
                        }}
                    >
                        {value ?? ""}
                    </Link>
                );
            },
        },
        {
            title: <span className="font-bold">{"Đơn vị quản lý"}</span>,
            dataIndex: "org_manage_id",
            width: '15%',
            render: (value: OrgTypeCategories) => {
                return <>{value?.name ?? ""}</>;
            },
        },
        {
            title: <span className="font-bold">{"Địa chỉ"}</span>,
            dataIndex: "ward_id",
            render: (value: WardCategories, record: any) => {
                if (record?.major_id === undefined && record?.ward_id === undefined) {
                    return null
                }
                const full_address = getFullAddressString(value)
                return <>{(record?.address ?? "") + ', ' + (full_address ?? "")}</>;
            },
        },
    ];
    const officalOptions: any = [
        {
            title: "Kiêm nhiệm",
            key: OFFICAL.KIEM_NHIEM,
        },
        {
            title: "Chính thức",
            key: OFFICAL.CHINH_THUC,
        },
    ];
    const treeFormat = (
        list: any[],
        idKey = "id",
        parentIdKey = "parent_id"
    ) => {
        const map: any = {};
        const tree: any[] = [];
        list.forEach((node) => {
            map[node?.[idKey]] = { children: [], data: { ...node } };
        });
        list.forEach((node) => {
            if (node?.[parentIdKey] !== null && map[node?.[parentIdKey]]) {
                map[node?.[parentIdKey]].children.push(map[node?.[idKey]]);
            } else {
                tree.push(map[node?.[idKey]]);
            }
        });

        return tree;
    };
    const fetchData = async () => {
        try {
            setLoading(true)
            let filterValue: any = {};
            let filterOrg: any = {};

            const roleName = userInfo?.role?.name;
            const org: Organizations | undefined = userInfo?.personal_id?.org_id;

            const getBaseFilterValue = (filter: any, filterLevel: any) => ({
                _and: [
                    { technical_id: { org_manage_id: { is_enable: true } } },
                    { type_id: { short_name: { _eq: type === ModalType.ToBD ? TechinicalType.ToBDKT : TechinicalType.TrCQDT } } },
                    { technical_id: { _and: [...(Array.isArray(filter._and) ? filter._and : [])] } },
                    filterLevel
                ]
            });

            const getBaseFilterOrg = () => ({
                _and: [
                    { is_enable: true }
                ]
            });

            if (roleName === ActorRole.CSKT_K1) {
                filterValue = {
                    _or: [
                        getBaseFilterValue(filter, filterLevel),
                    ]
                };
                filterOrg = {
                    _or: [
                        getBaseFilterOrg(),
                    ]
                };

            } else if (roleName === ActorRole.CSKT_DV) {
                const treePath = org?.parent_id?.tree_path || '';
                filterValue = {
                    _and: [
                        { technical_id: { org_manage_id: { tree_path: { _contains: treePath } } } },
                        { type_id: { short_name: { _eq: type === ModalType.ToBD ? TechinicalType.ToBDKT : TechinicalType.TrCQDT } } },
                        { technical_id: { _and: [...(Array.isArray(filter._and) ? filter._and : [])] } },
                        filterLevel
                    ]
                };

                filterOrg = {
                    _and: [
                        { tree_path: { _contains: org?.parent_id?.tree_path || org?.tree_path } },
                        { is_enable: true }
                    ]
                };
            } else {
                filterValue = {
                    _and: [
                        { type_id: { short_name: { _eq: type === ModalType.ToBD ? TechinicalType.ToBDKT : TechinicalType.TrCQDT } } },
                        { technical_id: { _and: [...(Array.isArray(filter._and) ? filter._and : [])] } },
                        filterLevel
                    ]
                };
            }
            const [regions, organizations, technicalTypes, totalTechnicalTypes, technicalType] = await Promise.all([
                getRegion({}, { is_enable: true }),
                getOrganizationTree({ ...filterOrg }),
                getTechnicalTypes(filterValue),
                metaTechnicalTypes(filterValue),
                getTechnicalTypeList({}, {})
            ]);

            setTechnicalId(technicalType.find((item: any) =>
                modalType.current === ModalType.ToBD
                    ? item?.short_name === 'to_bdktcd'
                    : item?.short_name === 'TRAM_CQDT'
            )?.id)
            const geoOptions = selectMap(regions, "name", "id");
            const orgTree = listToTree(organizations)
            setGeoOptions(geoOptions);
            setOrganizationOptions(orgTree);
            setOrganizationTree(treeFormat(organizations));
            console.log('technicalTypes > > > > > >', technicalTypes)
            setData(technicalTypes)
            setTotal(totalTechnicalTypes.count)
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false)
        }
    };

    const formValueChange = async () => {
        let filterValue: any = {
            _and: []
        };
        let filterLevel: any = {};
        if (form.getFieldValue('level')?.length) {
            filterLevel = {
                level: {
                    _in: form.getFieldValue('level'),
                }
            };
        }
        if (form.getFieldValue('is_offical')?.length) {
            filterValue = {
                _and: [
                    ...filterValue._and,
                    {
                        is_offical: {
                            _in: form.getFieldValue('is_offical'),
                        }
                    },
                ],
            };
        }
        if (form.getFieldValue('org_manage_id')?.length) {
            filterValue = {
                _and: [
                    ...filterValue._and,
                    {
                        org_manage_id: {
                            _in: form.getFieldValue('org_manage_id'),
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
        setFilter(filterValue)
        setFilterLevel(filterLevel)
    };
    const toggleOpen = () => setOpen(!open);
    const countFilter = () => 0
    const filterTreeData = (data: any[]) => {
        const filterTreeRecursive = (node: any) => {
            if (!node) return null;
            if (Array.isArray(node.children)) {
                node.children = node.children
                    .map(filterTreeRecursive)
                    .filter((child: any) => child !== null);
            }
            if (node.children && node.children.length === 0) {
                delete node.children;
            }
            return node;
        };
        return data.map(filterTreeRecursive).filter(node => node !== null);
    };
    const countLeafNodes = (node: any): number => {
        if (!node.children || node.children.length === 0) {
            return node.level !== undefined ? 1 : 0;
        }
        return node.children.reduce((sum: number, child: any) => sum + countLeafNodes(child), 0);
    };
    const listToTreeInTable = (
        list: any[],
    ) => {
        const mapDataToChildrenOrg = (node: any) => {
            const childrens = list.filter((item: any) => node?.data?.id === item?.org_manage_id?.id);
            const spreads = [
                ...(node.children ? node.children.map(mapDataToChildrenOrg).filter(Boolean) : []),
                ...childrens
            ];

            if (spreads.length > 0) {
                const leafCount = spreads.reduce((total: number, child: any) => total + countLeafNodes(child), 0);
                return {
                    ...node.data,
                    name: `${node.data.name} [${leafCount}]`,
                    children: spreads
                };
            }

            return undefined;
        };

        const treeWithChildren = organizationTree
            .map(mapDataToChildrenOrg)
            .filter(Boolean);
        console.log('treeWithChildren > > > > > >', treeWithChildren)

        return filterTreeData(treeWithChildren);
    };
    useEffect(() => {
        fetchData();
    }, [filter, filterLevel, type])

    return (
        <Form
            form={form}
            initialValues={{}}
            labelCol={{ span: 24 }}
            onValuesChange={formValueChange}
        >

            <div className="flex flex-row px-0 gap-2">
                <div
                    className={`transition-all duration-300 ${open ? 'w-[300px]' : 'w-12'} filter-container bg-white border rounded max-h-svh flex flex-col overflow-x-hidden`}>
                    <div className="flex flex-col">
                        <div className={`flex items-center px-4 py-2 ${open ? "border-b justify-between" : "justify-center"}`}>
                            <h3
                                className={`${open ? 'block' : 'hidden'
                                    } font-bold text-lg`}
                            >
                                <span className="font-bold text-[16px] leading-[26px] text-black">Bộ lọc tìm kiếm</span>
                            </h3>
                            <button onClick={toggleOpen}>
                                <Badge count={countFilter()} color="#0074D6" className="text-xl scale-[80%]">
                                    {open ? <MenuFoldOutlined /> : <FilterFilled className="text-[#8C9093]" />}
                                </Badge>
                            </button>
                        </div>
                        <div className={`${open ? 'block w-[300px]' : 'hidden'} px-4 flex-1 overflow-auto`}>
                            <Form.Item
                                label={
                                    <div className="flex flex-row gap-2">
                                        <img src={ic_geo} />
                                        <span className="text-[14px] font-bold leading-[24px]">Hình thức</span>
                                    </div>
                                }
                                // name={'mandate'}
                                className="mt-2"
                            >
                                <Col className="px-0 -mt-3" span={30}>
                                    <Checkbox.Group
                                        onChange={(checkedValues) => {
                                            form.setFieldsValue({ is_offical: checkedValues });
                                            formValueChange();
                                        }}
                                        style={{ width: "100%" }}
                                        className="flex flex-col"
                                    >
                                        {officalOptions?.map(
                                            (value: { title: string; key: string }) => (
                                                <Col className="mt-[10px]">
                                                    <Checkbox value={value.key}>
                                                        <span className="text-[14px] font-normal leading-[23px]">
                                                            {value.title}
                                                        </span>
                                                    </Checkbox>
                                                </Col>
                                            )
                                        )}
                                    </Checkbox.Group>
                                </Col>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <div className="flex flex-row gap-2">
                                        <img src={ic_geo} />
                                        <span className="text-[14px] font-bold leading-[24px]">Đơn vị</span>
                                    </div>
                                }
                            >
                                <TreeSelect
                                    multiple
                                    showCheckedStrategy="SHOW_ALL"
                                    treeCheckable
                                    size="small"
                                    showSearch
                                    filterTreeNode={(input: any, treeNode: any) => {
                                        return (
                                            treeNode.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        );
                                    }}
                                    style={{ width: "100%" }}
                                    placeholder="Chọn đơn vị"
                                    allowClear
                                    treeDefaultExpandAll
                                    treeData={organizationOptions}
                                    onChange={(checkedValues) => {
                                        form.setFieldsValue({ org_manage_id: checkedValues });
                                        formValueChange();
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <div className="flex flex-row gap-2">
                                        <img src={ic_geo} />
                                        <span className="text-[14px] font-bold leading-[24px]">Nhóm địa lý</span>
                                    </div>
                                }
                                className="-mt-2"
                            >
                                <Col className="px-0 -mt-3" span={30}>
                                    <Checkbox.Group
                                        onChange={(checkedValues) => {
                                            form.setFieldsValue({ geo: checkedValues });
                                            formValueChange();
                                        }}
                                        style={{ width: "100%" }}
                                        className="flex flex-col"
                                    >
                                        {geoOptions?.map(
                                            (data: { label: string; value: string }, index: number) => (
                                                <Col className="mt-[10px]">
                                                    <Checkbox value={data.value}>
                                                        <span className="text-[14px] font-normal leading-[23px]">
                                                            {data.label}
                                                        </span>
                                                    </Checkbox>
                                                </Col>
                                            )
                                        )}
                                    </Checkbox.Group>
                                </Col>
                            </Form.Item>
                        </div>
                    </div>
                </div>

                <div className="flex-col gap-0 bg-white rounded py-2 px-3 flex-1 overflow-auto">
                    <div className="flex flex-row justify-between items-center">
                        <span className="font-bold text-[16px]">{`${type === ModalType.ToBD ? 'Danh sách Tổ bảo đảm kỹ thuật cơ động' : 'Danh sách Trạm cáp quang đường trục'}: ${total}`}</span>
                        <div className="flex flex-row items-center justify-between">
                            <div className={`transition-all duration-300 w-[240px]`}>
                                <div>
                                    <Input
                                        className="flex rounded-full border-[1px] py-1 border-solid border-gray-300 gap-2 px-3 justify-center items-center transition-all duration-300"
                                        placeholder="Tìm kiếm"
                                        suffix={<SearchOutlined className="text-primary" />}
                                        onPressEnter={(e: any) => {
                                            e.preventDefault();
                                            form.setFieldsValue({ search: e.target.value });
                                            formValueChange();
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex px-2">
                                <Button
                                    size="small"
                                    className="rounded w-[100px]"
                                    type="primary"
                                    onClick={() => {
                                        openModal(
                                            <TechnicalAssuranceAction type_id={technicalId} action={Action.Create} modalType={modalType.current} />,
                                            {
                                                width: '55vw',
                                                onModalClose(res) {
                                                    if (res?.success) {
                                                        fetchData();
                                                    }
                                                },
                                            }
                                        )
                                    }}
                                >
                                    <span>Thêm mới</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-col  border-gray-300 my-2 h-[800px]">
                            {loading ? <Skeleton /> : (
                                <Table
                                    className="org-leave-manage-table overflow-auto custom-ant-table"
                                    dataSource={listToTreeInTable([...data])}
                                    columns={columns}
                                    pagination={false}
                                    expandable={{
                                        expandedRowKeys: expandedRowKeys,
                                        onExpand: (expanded, record) => {
                                            if (expanded) {
                                                setExpandedRowKeys((prev) => [...prev, record.key]);
                                            } else {
                                                setExpandedRowKeys((prev) =>
                                                    prev.filter((key) => key !== record.key)
                                                );
                                            }
                                        },
                                        expandIcon: ({ expanded, onExpand, record }) => {
                                            return record?.children ? (
                                                !expanded ? (
                                                    <PlusOutlined
                                                        style={{ marginRight: "10px", height: "10px", width: "10px" }}
                                                        rev={undefined}
                                                        onClick={(e) => {
                                                            onExpand(record, e);
                                                        }}
                                                    />
                                                ) : (
                                                    <MinusOutlined
                                                        style={{ marginRight: "10px", height: "10px", width: "10px" }}
                                                        rev={undefined}
                                                        onClick={(e) => {
                                                            onExpand(record, e);
                                                        }}
                                                    />
                                                )
                                            ) : null;
                                        },
                                    }}
                                    scroll={{ y: 700 }}
                                    rowClassName="hover:bg-secondary group"
                                    rowKey={'id'}
                                />
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </Form >

    )

}
export default TechnicalAssuranceTeam;
