import { Button, Skeleton, Table, message } from "antd";
import { useEffect, useState } from "react";
import { getReportAmountTbvtByGroupEquipment } from "../stores/Report.action";
import { getAmountTbvtByGroupEquipment, getGroupEquipment } from "../stores/TongHop.action";
import { getFullAddressString } from "@app/core/helper";
import { getOrganizationTree } from "../stores/TechnicalOrganization.action";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { userStore } from "@app/store/user/user.store";
import { Organizations } from "@app/types/types";

type CbnvTechnicalByOrgProps = {
    type?: any;
    tree_path?: string;
};

const TongHopTechnicalByOrg: React.FC<CbnvTechnicalByOrgProps> = ({ type, tree_path }) => {
    const navigate = useNavigate();
    const { userInfo } = userStore();
    const [groupEquipment, setGroupEquipment] = useState<any[]>([]);
    const [dataSource, setDataSource] = useState<any>([]);
    const [organizationTree, setOrganizationTree] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const processColumns = (data: any) => {
        const columns = data.map((parent: any) => ({
            title: <p className="font-bold text-center">{parent.data.name}</p>,
            align: 'right',
            dataIndex: parent.data.short_name,
            key: parent.data.short_name,
            render: (value: string) => value || '',
            children: parent.children.length > 0
                ? [
                    {
                        title: <p className="font-bold text-center">SL</p>,
                        align: 'right',
                        dataIndex: parent.data.short_name,
                        key: parent.data.short_name,
                        render: (value: string) => value || '',
                        width: '4%',
                    },
                    ...parent.children.map((child: any) => ({
                        title: (
                            <div
                                className="font-bold text-center w-full items-center flex"
                                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                            >
                                {child.data.name}
                            </div>
                        ),
                        align: 'right',
                        dataIndex: child.data.short_name,
                        key: child.data.short_name,
                        width: '4%',
                        render: (value: string) => value || '',
                    })),
                ]
                : parent.children.map((child: any) => ({
                    title: <p className="font-bold text-center">{child.data.name}</p>,
                    align: 'right',
                    dataIndex: child.data.short_name,
                    key: child.data.short_name,
                    width: '5%',
                    render: (value: string) => value || ''
                })),
        }));
        columns.push({
            title: <p className="font-bold text-center">  Khác</p>,
            align: 'right',
            dataIndex: 'other',
            key: 'other',
            width: '4%',
        });
        return [
            // {
            //     title: <p className="font-bold text-center">STT</p>,
            //     dataIndex: 'index',
            //     key: 'index',
            //     width: '60px',
            //     align: 'left',
            //     fixed: 'left',
            // },
            {
                title: <p className="font-bold text-center">Đơn vị</p>,
                dataIndex: 'name',
                key: 'name',
                width: '10%',
                align: 'left',
                fixed: 'left',
                render: (value: string, record: any) => {
                    console.log('record: ', record)
                    if (!record.children) {
                        return (
                            <Link
                                className="cursor-pointer text-[#3D73D0]"
                                to={`/quan-ly-cskt/${record?.id}`}
                                onClick={(event) => {
                                    event.preventDefault();
                                    navigate(`/quan-ly-cskt/${record?.id}`, {
                                        state: {
                                            tab: type,
                                            name: record?.name
                                        }
                                    })
                                }}
                            >
                                {value ?? ""}
                            </Link >
                        )
                    } else {
                        return value
                    }
                }
            },
            {
                title: <p className="font-bold text-center">Địa danh</p>,
                dataIndex: 'ward_id',
                key: 'ward_id',
                width: '15%',
                align: 'left',
                render: (value: any, record: any) => {
                    const address = record?.address || '';
                    const fullAddress = getFullAddressString(value);
                    return `${address}${address ? ', ' : ''}${fullAddress}`;
                }
            },
            {
                title: <p className="font-bold text-center">Đơn vị tính</p>,
                dataIndex: 'dvt',
                key: 'dvt',
                align: 'left',
                width: '5%',
            },
            {
                title: <p className="font-bold text-center">Số lượng tổ BĐKT</p>,
                dataIndex: 'totalToBDKT',
                key: 'totalToBDKT',
                align: 'right',
                width: '5%',
            },
            ...columns,
            {
                title: <p className="font-bold text-center">Phương tiện cơ động</p>,
                dataIndex: 'transport',
                align: 'left',
                key: 'transport',
                width: '5%',
                fixed: 'left',
                render: (value: any) => {
                    return value ? value : ''
                }
            },
            {
                title: <p className="font-bold text-center">Ghi chú</p>,
                dataIndex: 'note',
                key: 'note',
                width: '5%',
                align: 'left',
                fixed: 'left',
            }];
    };
    const treeFormat = (
        list: any[],
        idKey = "id",
        parentIdKey = "parent_id"
    ) => {
        const map: Record<string, any> = {};
        const tree: any[] = [];
        list.forEach((node: any) => {
            map[node[idKey]] = { children: [], data: { ...node } };
        });
        list.forEach((node: any) => {
            if (node[parentIdKey] !== null && map[node[parentIdKey]]) {
                map[node[parentIdKey]].children.push(map[node[idKey]]);
            } else {
                tree.push(map[node[idKey]]);
            }
        });
        return tree;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [organizations, fetchedGroupEquipment, technicalTbvt] = await Promise.all([
                getOrganizationTree({
                    _and: [
                        { tree_path: { _contains: tree_path } },
                        { is_enable: true }
                    ]
                }),
                getGroupEquipment({ limit: -1 }, {}),
                getAmountTbvtByGroupEquipment({ tree_path, type })
            ])
            setGroupEquipment(treeFormat(fetchedGroupEquipment));
            setOrganizationTree(
                treeFormat(organizations)
            );
            setDataSource(technicalTbvt);
        } catch (error: any) {
            console.log('error: ', error)
        } finally {
            setLoading(false);
        }
    }
    const countLeafNodes = (node: any): number => {
        if (!node.children || node.children.length === 0) {
            return node.level !== undefined ? 1 : 0;
        }
        return node.children.reduce((sum: number, child: any) => sum + countLeafNodes(child), 0);
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
    function calculateDynamicValues(node: any) {
        if (node.children && node.children.length > 0) {
            const totals: any = {};
            node.children.forEach((child: any) => {
                calculateDynamicValues(child);

                for (const [key, value] of Object.entries(child)) {
                    if (typeof value === "number") {
                        totals[key] = (totals[key] || 0) + value;
                    }
                }
            });
            Object.assign(node, totals);
        }
    }

    const listToTreeInTable = (list: any[]) => {
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

        const processedTree = filterTreeData(treeWithChildren)?.map((node: any) => {
            calculateDynamicValues(node);
            return node;
        });

        return processedTree;
    };

    const getReport = async () => {
        try {
            const org: Organizations | undefined = userInfo?.personal_id?.org_id;

            const response: any = await getReportAmountTbvtByGroupEquipment({
                current_tree_path: tree_path,
                parent_tree_path: org?.parent_id?.tree_path || '',
                type: type,
            });
            // console.log('response >>> ', response)
            const blob = await response.blob();
            const fileURL = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute("download", "Tong-hop-CSKT.xlsx");
            link.click();
        } catch (error) {
            console.log('Error generating report:', error);
            message.error('Error generating report.');
        }
    };

    useEffect(() => {
        if (tree_path) {
            fetchData();
        }
    }, [type, tree_path]);

    return (
        <div className="flex flex-row px-0 gap-2">
            <div className="flex-col gap-0 bg-white rounded flex-1 overflow-auto">
                <div className="flex flex-col border-gray-300 h-[800px]">
                    {loading ? <Skeleton active /> : (
                        <div className="flex flex-col">
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
                            <div className="container-larger-extra">
                                <Table
                                    columns={processColumns(groupEquipment)}
                                    dataSource={listToTreeInTable([...dataSource])}
                                    bordered
                                    scroll={{ x: 2500 }}
                                    pagination={false}
                                    rowKey="key"
                                    style={{ width: '100%', tableLayout: 'fixed' }}
                                    expandable={{
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
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TongHopTechnicalByOrg;