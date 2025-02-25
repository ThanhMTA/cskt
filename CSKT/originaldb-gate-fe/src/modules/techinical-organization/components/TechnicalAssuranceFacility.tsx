import { FilterFilled, MenuFoldOutlined, MinusOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Checkbox, Col, Form, Input, Skeleton, Table, TableColumnsType, TreeSelect } from "antd";
import { Key, useEffect, useRef, useState } from "react";
import { getFullAddressString, listToTree, selectMap } from "@app/core/helper";
import { getRegion } from "@app/modules/it-categories/store/Region.action";
import { LevelCategoriesScope, ModalType } from "../enum/LevelCategory.enum";
import { getOrganizationTree } from "../stores/TechnicalOrganization.action";
import { getTechnicalTypeTree } from "../stores/TechnicalType.action";
import { ic_geo } from "@app/assets/svg";
import { OFFICAL } from "@app/modules/technical-categories/enums/TechnicalTeams.enum";
import "../styles/style.scss"
import TechnicalAssuranceAction from "./TechnicalAssuranceAction";
import { useModal } from "@app/contexts/ModalContext";
import { userStore } from "@app/store/user/user.store";
import { ActorRole } from "../constants/level.constant";
import { Organizations, OrgTypeCategories, WardCategories } from "@app/types/types";
import { Action } from "@app/enums";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { arrayToTree } from "performant-array-to-tree";
import { TechnicalOrganizationData } from "../types/TechnicalOrganization.type";
import { getTechnicalTypes, metaTechnicalTypes } from "../stores/TechnicalTypes.action";

export default function TechnicalAssuranceFacility() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const defaultTab = params.get('tab') ?? '';
    const modalType = useRef<ModalType>(ModalType.CSBD);
    const { openModal } = useModal();
    const { userInfo } = userStore();
    const [open, setOpen] = useState<boolean>(true);
    const [total, setTotal] = useState<number>(0);
    const [data, setData] = useState<TechnicalOrganizationData[]>([]);
    const [technicalTypeTree, setTechnicalTypeTree] = useState<any>([]);
    const [geoOptions, setGeoOptions] = useState<any[]>([]);
    const [organizationTree, setOrganizationTree] = useState<any[]>([]);
    const [filter, setFilter] = useState<any>({ _and: [] });
    const [loading, setLoading] = useState<boolean>(false);
    const [filterLevel, setFilterLevel] = useState<any>({})
    const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
    const [form] = Form.useForm();
    const columns: TableColumnsType<any> = [
        {
            title: <span className="font-bold">{"Tên"}</span>,
            dataIndex: "name",
            width: '40%',
            render: (value: any, record: any) => {
                if (record?.major_id === undefined && record?.ward_id === undefined)
                    return value ?? ""
                else
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
                            }
                            }
                        >
                            {value ?? ""}
                        </Link >
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
    const levelOptions: any = [
        {
            title: "Chiến dịch",
            key: LevelCategoriesScope.CHIEN_DICH,
        },
        {
            title: "Chiến lược",
            key: LevelCategoriesScope.CHIEN_LUOC,
        },
        {
            title: "Chiến thuật",
            key: LevelCategoriesScope.CHIEN_THUAT
        },
    ];
    const officalOptions: any = [
        {
            title: "Kiêm nhiệm",
            key: OFFICAL.KIEM_NHIEM
        },
        {
            title: "Chính thức",
            key: OFFICAL.CHINH_THUC
        },
    ];
    const fetchData = async () => {
        try {
            setLoading(true)
            let filterValue: any = {};
            let filterOrg: any = {};

            const roleName = userInfo?.role?.name;
            const org: Organizations | undefined = userInfo?.personal_id?.org_id;

            const baseFilterOrg = (code: string) => ({
                _and: [
                    { code: { _contains: code } },
                    { is_enable: true }
                ]
            });

            const baseFilterValue = (code: string, filter: any, filterLevel: any) => ({
                _and: [
                    { technical_id: { org_manage_id: { code: { _contains: code } } } },
                    { technical_id: { org_manage_id: { is_enable: true } } },
                    { technical_id: { _and: [...(Array.isArray(filter._and) ? filter._and : [])] } },
                    filterLevel
                ]
            });

            if (roleName === ActorRole.CSKT_K1) {
                filterValue = {
                    _or: [
                        baseFilterValue('43', filter, filterLevel),
                        baseFilterValue('70', filter, filterLevel)
                    ]
                };

                filterOrg = {
                    _or: [
                        baseFilterOrg('43'),
                        baseFilterOrg('70')
                    ]
                };
            } else if (roleName === ActorRole.CSKT_DV) {
                const treePath = org?.parent_id?.tree_path || '';
                filterValue = {
                    _and: [
                        { technical_id: { org_manage_id: { tree_path: { _contains: treePath }, ...filter._and } } },
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
                        { technical_id: { _and: [...(Array.isArray(filter._and) ? filter._and : [])] } },
                        filterLevel
                    ]
                };
            }
            const [regions, organizations, technicalTypeTree, technicalTypes, totalTechnicalTypes] = await Promise.all([
                getRegion({}, { is_enable: true }),
                getOrganizationTree({ ...filterOrg }),
                getTechnicalTypeTree({}, {}),
                getTechnicalTypes(filterValue),
                metaTechnicalTypes(filterValue)
            ]);
            const geoOptions = selectMap(regions, "name", "id");
            const orgTree = listToTree(organizations);
            setGeoOptions(geoOptions);
            setOrganizationTree(orgTree);
            setTechnicalTypeTree(arrayToTree([...technicalTypeTree]));
            setData(technicalTypes)
            setTotal(totalTechnicalTypes.count)
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false)
        }
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
        const mapDataToChildren: any = (node: any) => {
            const childrens = list.filter((item: any) => node?.data?.id === item?.type_id?.id);
            const spreads = [
                ...(node.children ? node.children.map(mapDataToChildren) : []),
                ...childrens
            ]
            if (spreads.length > 0) {
                const leafCount = spreads.reduce((total: number, child: any) => total + countLeafNodes(child), 0);
                return (
                    {
                        ...node.data,
                        name: node.data.name + ` [${leafCount}] `,
                        children: spreads
                    }
                )
            } else return ({
                ...node.data
            })
        };
        return technicalTypeTree.map(mapDataToChildren)

    };
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
        setFilter(filterValue);
        setFilterLevel(filterLevel)
    };
    const toggleOpen = () => {
        setOpen(!open);
    };
    const countFilter = () => {
        return 0
    }
    useEffect(() => {
        fetchData()
    }, [filter, filterLevel])

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
                                        <span className="text-[14px] font-bold leading-[24px]">Phân cấp</span>
                                    </div>
                                }
                                className="mt-2"
                            >
                                <Col className="px-0 -mt-3" span={30}>
                                    <Checkbox.Group
                                        style={{ width: "100%" }}
                                        className="flex flex-col"
                                        onChange={(checkedValues) => {
                                            form.setFieldsValue({ level: checkedValues });
                                            formValueChange();
                                        }}
                                    >
                                        {levelOptions?.map(
                                            (value: { title: string; key: string }, index: number) => (
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
                                }>
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
                                    className="-mt-3"
                                    style={{ width: "100%" }}
                                    placeholder="Chọn đơn vị"
                                    allowClear
                                    treeDefaultExpandAll
                                    treeData={organizationTree}
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
                                className="-mt-2">
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
                            <Form.Item
                                label={
                                    <div className="flex flex-row gap-2">
                                        <img src={ic_geo} />
                                        <span className="text-[14px] font-bold leading-[24px]">Chức năng nhiệm vụ</span>
                                    </div>
                                }>
                                <Col className="px-0 -mt-3" span={30}>
                                    <Checkbox.Group
                                        style={{ width: "100%" }}
                                        className="flex flex-col"
                                        onChange={(checkedValues) => {
                                            form.setFieldsValue({ is_offical: checkedValues });
                                            formValueChange();
                                        }}
                                    >
                                        {officalOptions?.map(
                                            (value: { title: string; key: string }, index: number) => (
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
                        </div>
                    </div>
                </div>
                <div className="flex-col gap-0 bg-white rounded py-2 px-3 flex-1 overflow-auto">
                    <div className="flex flex-row justify-between items-center">
                        <span className="font-bold text-[16px]">{`Danh sách Cơ sở kỹ thuật: ${total}`}</span>
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
                                            <TechnicalAssuranceAction action={Action.Create} modalType={modalType.current} />,
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
                    <div className="flex flex-col border-gray-300 my-2 h-[800px]">
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
        </Form>


    )

}