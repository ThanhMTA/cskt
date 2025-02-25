import { Button, Table, TableColumnsType } from "antd";
import { Key, useEffect, useState } from "react";
import { ModalType, TechinicalType } from "../enum/LevelCategory.enum";
import { getFullAddressString } from "@app/core/helper";
import { getOrganizationTree } from "../stores/TechnicalOrganization.action";
import { OrgTypeCategories, WardCategories } from "@app/types/types";
import { TechnicalOrganizationData } from "../types/TechnicalOrganization.type";
import { getTechnicalTypes } from "../stores/TechnicalTypes.action";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { getReportToDBKTByOrg } from "../stores/Report.action";

type TechnicalAssuranceTeamType = {
    type?: any;
    tree_path?: string;
};
const TechnicalAssuranceTeamByOrg: React.FC<TechnicalAssuranceTeamType> = ({ type, tree_path }) => {
    const [data, setData] = useState<TechnicalOrganizationData[]>([]);
    const [organizationTree, setOrganizationTree] = useState<any[]>([])
    const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
    const columns: TableColumnsType<any> = [
        {
            title: <span className="font-bold">{"Tên"}</span>,
            dataIndex: "name",
            width: '40%'
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
            const [organizations, technicalTypes] = await Promise.all([
                getOrganizationTree({
                    _and: [
                        { tree_path: { _contains: tree_path } },
                        { is_enable: true }
                    ]
                }),
                getTechnicalTypes({
                    _and: [
                        { technical_id: { org_manage_id: { tree_path: { _contains: tree_path } } } },
                        { technical_id: { org_manage_id: { is_enable: true } } },
                        { type_id: { short_name: { _eq: type === ModalType.ToBD ? TechinicalType.ToBDKT : TechinicalType.TrCQDT } } },
                    ]
                }),
            ]);
            setOrganizationTree(treeFormat(organizations));
            setData(technicalTypes)
        } catch (error) {
            console.error('Failed to fetch data:', error);
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
    };
    const getReport = async () => {
        try {
            const response: any = await getReportToDBKTByOrg({ tree_path: tree_path, type: type })
            const blob = await response.blob();
            const fileURL = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute("download", "Tong-hop-ToBDKT.docx");
            link.click();
        } catch (error) {
            console.log('error: ', error)
        }
    }

    useEffect(() => {
        if (tree_path)
            fetchData();
    }, [type, tree_path])
    
    return (
        <div className="flex flex-row px-0 gap-2">
            <div className="flex-col gap-0 bg-white rounded flex-1 overflow-auto">
                <div className="flex flex-col">
                    <div className="flex flex-col border-gray-300 h-[800px]">
                        <div className="flex justify-end p-2 -mt-2">
                            <Button
                                size="small"
                                className="rounded w-[100px]"
                                type="primary"
                                onClick={getReport}
                            >
                                <span className="text-white">In báo cáo</span>
                            </Button>
                        </div>
                        <Table
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
                    </div>
                </div>

            </div>
        </div>
    )

}
export default TechnicalAssuranceTeamByOrg;