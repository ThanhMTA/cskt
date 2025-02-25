import BaseTable from "@app/components/BaseTable";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { OrgTypeCategories, WardCategories } from "@app/types/types";
import { Skeleton, TableColumnsType } from "antd";
import { Key, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getOrganizationTree } from "../stores/TechnicalOrganization.action";
import { TechnicalOrganizationData } from "../types/TechnicalOrganization.type";
import { getTechnicalTypeTree } from "../stores/TechnicalType.action";
import { arrayToTree } from "performant-array-to-tree";
import "../styles/style.scss"
import { getFullAddressString } from "@app/core/helper";
import { getTechnicalTypes, metaTechnicalTypes } from "../stores/TechnicalTypes.action";
type Props = {
    filter?: any,
    type: 'cs-bdkt' | 'to_bdktcd',
    setTotal?: any
}

export default function TableComponent({ filter, type, setTotal }: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const defaultTab = params.get('tab') ?? '';
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<TechnicalOrganizationData[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
    const [technicalTypeTree, setTechnicalTypeTree] = useState<any>([]);
    const [organizationTree, setOrganizationTree] = useState<any>([]);

    const columns: TableColumnsType<any> = [
        {
            title: <span className="font-bold">{"Tên"}</span>,
            dataIndex: "name",
            width: '40%',
            render: (value: any, record: any) => {
                if (record?.major_id === undefined && record?.ward_id === undefined) {
                    if (type === 'to_bdktcd')
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
                    else return value ?? ""
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
    const fetchData = async (filter: any = {}) => {
        try {
            setIsLoading(true);
            const [technicalTypes, technicalTypeTree, organizationTree, metaData] = await Promise.all([
                getTechnicalTypes({ ...filter }),
                getTechnicalTypeTree({}, {}),
                getOrganizationTree({}),
                metaTechnicalTypes({ ...filter })
            ]);
            console.log('technicalTypes: ', technicalTypes)
            setData(technicalTypes);
            setTechnicalTypeTree(arrayToTree([...technicalTypeTree]));
            setOrganizationTree(arrayToTree([...organizationTree]));
            setTotal(metaData.count);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };


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
        if (type === 'cs-bdkt') {
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
        } else {
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
            return filterTreeData(treeWithChildren);

        }

    };
    useEffect(() => {
        fetchData(filter);
    }, [filter])
    return (
        isLoading ? (
            <Skeleton />
        ) : (
            <div className="flex flex-col  border-gray-300 my-2">
                <BaseTable
                    hiddenIndex
                    className="org-leave-manage-table overflow-auto custom-ant-table"
                    isReloadButton={true}
                    dataSource={listToTreeInTable([...data])}
                    columns={columns}
                    actionWidth={50}
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
                    }}
                    scroll={{ x: "1000", y: 1000 }}
                    rowClassName="hover:bg-secondary group"
                    isAction={true}
                    rowKey={'id'}
                    filterColumns={[TableGeneralKeys.Name]}
                    btnCreate={false}
                />
            </div>
        )
    )
}
















