import { Button, Skeleton, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { getOrganizationTree, getTechnicalCBNVDetail } from "../stores/TechnicalOrganization.action";
import { TechnicalOrganizationData } from "../types/TechnicalOrganization.type";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { getTechnicalTypes } from "../stores/TechnicalTypes.action";
import { ModalType, TechinicalType } from "../enum/LevelCategory.enum";
import dayjs from "dayjs";
import { getReportCBNVCMKTByOrg } from "../stores/Report.action";

type CbnvTechnicalByOrgType = {
    type?: any;
    tree_path?: string;
};
const CbnvTechnicalByOrg: React.FC<CbnvTechnicalByOrgType> = ({ type, tree_path }) => {
    const [data, setData] = useState<TechnicalOrganizationData[]>([]);
    const [organizationTree, setOrganizationTree] = useState<any[]>([])
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loadingTable, setLoadingTable] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const columns: TableColumnsType<any> = [
        {
            title: <span className="font-bold">{"STT"}</span>,
            dataIndex: "index",
            width: '5%'
        },
        {
            title: <span className="font-bold">{"Họ và tên"}</span>,
            dataIndex: "name",
            width: '15%'
        },
        {
            title: <span className="font-bold">{"Nhập ngũ"}</span>,
            dataIndex: "date_of_join_army",
            render: (text: string) => {
                return text ? dayjs(text).format('DD/MM/YYYY') : '';
            },
        },
        {
            title: <span className="font-bold">{"Cấp bậc"}</span>,
            dataIndex: "rank_id",
            render: (value: any) => value?.name
        },
        {
            title: <span className="font-bold">{"Đơn vị"}</span>,
            dataIndex: "org_id",
            render: (value: any) => value?.name
        },
        {
            title: <span className="font-bold">{"Học vấn"}</span>,
            dataIndex: "degree_id",
            render: (value: any) => value?.name
        },
        {
            title: <span className="font-bold">{"Chuyên ngành"}</span>,
            dataIndex: "major_id",
            render: (value: any) => value?.name
        },
        {
            title: <span className="font-bold">{"SĐT"}</span>,
            dataIndex: "phone_number",
        },
        {
            title: <span className="font-bold">{"Ghi chú"}</span>,
            dataIndex: "note",
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
            const [organizations, technicalTypes] = await Promise.all([
                getOrganizationTree({
                    _and: [
                        { tree_path: { _contains: tree_path } },
                    ]
                }),
                getTechnicalTypes({
                    _and: [
                        { technical_id: { org_manage_id: { tree_path: { _contains: tree_path } } } },
                        { type_id: { short_name: { _eq: type === ModalType.ToBD ? TechinicalType.ToBDKT : TechinicalType.TrCQDT } } },
                    ]
                }),
            ]);

            setOrganizationTree(treeFormat(organizations));
            setData(technicalTypes)
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false)
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
    }
    const findDeepestParentsWithChildren = (node: any): any[] => {
        if (node.tree_path === undefined) {
            return []
        }

        let deepestParents: any[] = [];

        node.children.forEach((child: any) => {
            const deepest = findDeepestParentsWithChildren(child);
            if (deepest.length > 0) {
                deepestParents = deepestParents.concat(deepest);
            }
        });
        return deepestParents.length > 0 ? deepestParents : [node];
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
                return {
                    ...node.data,
                    name: `${node.data.name}`,
                    children: spreads
                };
            }
            return undefined;
        };

        const treeWithChildren = organizationTree
            .map(mapDataToChildrenOrg)
            .filter(Boolean);

        const filteredTree = filterTreeData(treeWithChildren);
        const deepest_parents = filteredTree.flatMap(item => {
            return findDeepestParentsWithChildren(item);
        });
        return deepest_parents;
    };
    const toRoman = (num: number) => {
        const romanNumerals = [
            { value: 10, numeral: 'X' },
            { value: 9, numeral: 'IX' },
            { value: 5, numeral: 'V' },
            { value: 4, numeral: 'IV' },
            { value: 1, numeral: 'I' }
        ];

        let result = '';
        for (const { value, numeral } of romanNumerals) {
            while (num >= value) {
                result += numeral;
                num -= value;
            }
        }
        return result;
    };
    const toggleExpand = async (index: number, technicalOrgIds?: string[]) => {
        setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
        try {
            setLoadingTable(true);
            const res = await getTechnicalCBNVDetail({ limit: -1 }, {
                technical_org_id: {
                    id: {
                        _in: technicalOrgIds
                    }
                },
            });
            const cbnvcmMapTechnical: any = {};
            const indexCounters: any = {};
            const romanIndexCounter = { current: 1 };

            for (const item of res) {
                const { technical_org_id, personal_identifies_id } = item;

                if (!indexCounters[technical_org_id?.id]) {
                    indexCounters[technical_org_id?.id] = 1;
                }


                if (!cbnvcmMapTechnical[technical_org_id?.id]) {
                    cbnvcmMapTechnical[technical_org_id?.id] = [
                        {
                            index: `${toRoman(romanIndexCounter.current)}.`,
                            name: technical_org_id?.name,
                        },
                        {
                            ...personal_identifies_id,
                            index: indexCounters[technical_org_id?.id]++
                        }];
                    romanIndexCounter.current++;
                } else {
                    cbnvcmMapTechnical[technical_org_id?.id].push({
                        ...personal_identifies_id,
                        index: indexCounters[technical_org_id?.id]++
                    });
                }
            }
            setDataSource(Object.values(cbnvcmMapTechnical).flat())
        } catch (error: any) {
            console.log('error: ', error)
        } finally {
            setLoadingTable(false)
        }
    };

    const getReport = async () => {
        try {
            const response: any = await getReportCBNVCMKTByOrg({ tree_path: tree_path, type: type })
            const blob = await response.blob();
            const fileURL = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute("download", "Tong-hop-CBNVCMKT.docx");
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
                        {loading ? <Skeleton /> : (
                            <div>
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
                                {listToTreeInTable([...data])?.map((item, index: number) => {
                                    const isExpanded = expandedIndex === index; // Check if the item is expanded
                                    const technicalOrgIds = item?.children.map((child: any) => child?.technical_id.id);
                                    return (
                                        <div key={index.toString()} className="py-2 rounded border m-1">
                                            <div className="flex flex-row gap-0 items-center px-1">
                                                {isExpanded ? (
                                                    <MinusOutlined
                                                        style={{ marginRight: "10px", height: "10px", width: "10px", cursor: 'pointer' }}
                                                        rev={undefined}
                                                        onClick={() => toggleExpand(index, technicalOrgIds)}

                                                    />
                                                ) : (
                                                    <PlusOutlined
                                                        style={{ marginRight: "10px", height: "10px", width: "10px", cursor: 'pointer' }}
                                                        rev={undefined}
                                                        onClick={() => toggleExpand(index, technicalOrgIds)}
                                                    />
                                                )}

                                                <span>{item?.name}</span>
                                            </div>
                                            {isExpanded && (
                                                <div className="ml-2">
                                                    <Table
                                                        dataSource={dataSource}
                                                        columns={columns}
                                                        pagination={false}
                                                        loading={loadingTable}
                                                        scroll={{ y: 400 }}
                                                        rowClassName="hover:bg-secondary group"
                                                        rowKey={'id'}
                                                    />
                                                </div>

                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

}
export default CbnvTechnicalByOrg;



