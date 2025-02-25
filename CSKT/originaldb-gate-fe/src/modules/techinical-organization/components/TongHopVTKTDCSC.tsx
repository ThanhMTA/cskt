import { Button, Popover, Skeleton, TableColumnsType } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrganizationsDetail } from "@app/modules/force-categories/store/Organizations.action";
import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import BaseTable from "@app/components/BaseTable";
import { getTechnicalTBVTDetail } from "../stores/TechnicalOrganization.action";
import { listToTree } from "@app/core/helper";
import TBVTDCSCDetail from "./TBVTDCSCDetail";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { getTBVTCategoriesList } from "@app/modules/force-categories/store/TBVTCategories.action";
import { getReportTBVTByOrg } from "../stores/Report.action";

export default function TongHopVTKTDCSC() {
    const routeParams: any = useParams();
    const { id } = routeParams;
    const [organization, setOrganization] = useState<OrganizationsData | undefined>(undefined);
    const [tbvtCategories, setTbvtCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    function updateLevels(node: any, dataMap: any) {
        let levelSum = {
            level_1: node.level_1,
            level_2: node.level_2,
            level_3: node.level_3,
            level_4: node.level_4,
            level_5: node.level_5
        };

        for (const child of Object.values(dataMap)) {
            if (child.parent_id === node.id) {
                const childLevels = updateLevels(child, dataMap);

                levelSum.level_1 += childLevels.level_1;
                levelSum.level_2 += childLevels.level_2;
                levelSum.level_3 += childLevels.level_3;
                levelSum.level_4 += childLevels.level_4;
                levelSum.level_5 += childLevels.level_5;
            }
        }

        node.level_1 = levelSum.level_1;
        node.level_2 = levelSum.level_2;
        node.level_3 = levelSum.level_3;
        node.level_4 = levelSum.level_4;
        node.level_5 = levelSum.level_5;

        return levelSum;
    }
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getOrganizationsDetail(id, {});
            if (!res) {
                console.log('No organization details found.');
                return;
            }
            setOrganization(res);
            const { tree_path } = res;
            const filters = {
                technical_org_id: {
                    org_manage_id: {
                        tree_path: { _contains: tree_path }
                    }
                }
            };
            const response = await getTechnicalTBVTDetail({ limit: -1 }, filters);

            const tbvtCategoriesMap: any = {};

            for (const item of response) {
                const { tbvt_categories_id: { id, tree_path }, quality, amount } = item;
                const tree_paths_filter = tree_path.split('.').reduce((acc: any, curr: any) => {
                    acc.push(acc.length ? `${acc[acc.length - 1]}.${curr}` : curr);
                    return acc;
                }, []);

                const categoryRes = await getTBVTCategoriesList({}, {
                    tree_path: {
                        _in: tree_paths_filter
                    }
                });

                for (const category of categoryRes) {
                    if (!tbvtCategoriesMap[category.id]) {
                        tbvtCategoriesMap[category.id] = {
                            ...category,
                            level_1: 0,
                            level_2: 0,
                            level_3: 0,
                            level_4: 0,
                            level_5: 0,
                            name: `${category?.code} - ${category?.name}`
                        };
                    }
                }

                // Update quality levels
                const category = tbvtCategoriesMap[id];
                if (category) {
                    const amountInt = parseInt(amount);
                    if (Number(quality) === 1) category.level_1 += amountInt;
                    if (Number(quality) === 2) category.level_2 += amountInt;
                    if (Number(quality) === 3) category.level_3 += amountInt;
                    if (Number(quality) === 4) category.level_4 += amountInt;
                    if (Number(quality) === 5) category.level_5 += amountInt;
                }
            }

            const data: any = Object.values(tbvtCategoriesMap);

            const dataMap = Object.fromEntries(data.map((item: any) => [item.id, item]));
            for (const node of data) {
                if (!node.parent_id) {
                    updateLevels(node, dataMap);
                }
            }
            setTbvtCategories(data);

        } catch (error: any) {
            console.error('Error fetching data: ', error);
        } finally {
            setLoading(false);
        }
    };


    const columns: TableColumnsType<any> = [
        {
            title: <span className="font-bold">{"Tên dụng cụ, VT sửa chữa"}</span>,
            dataIndex: "name",
            render: (value: string, record: any) => {
                return (
                    <Popover
                        placement="rightBottom"
                        content={<TBVTDCSCDetail data={record} tree_path={organization?.tree_path} />}
                        title={`Chi tiết [${record.name}]`}
                        trigger="click"
                    >
                        <span className="cursor-pointer text-[#3D73D0]">
                            {value}
                        </span>
                    </Popover>
                );
            }
        },
        {
            title: <span className="font-bold">{"Tổng"}</span>,
            dataIndex: "total",
            width: '10%',
            render: (value: any, record: any) => {
                const {
                    level_1 = 0,
                    level_2 = 0,
                    level_3 = 0,
                    level_4 = 0,
                    level_5 = 0
                } = record;
                return level_1 + level_2 + level_3 + level_4 + level_5;
            }

        },
        {
            title: <span className="font-bold">{"Cấp 1"}</span>,
            dataIndex: "level_1",
            width: '10%'
        },
        {
            title: <span className="font-bold">{"Cấp 2"}</span>,
            dataIndex: "level_2",
            width: '10%'
        },
        {
            title: <span className="font-bold">{"Cấp 3"}</span>,
            dataIndex: "level_3",
            width: '10%'
        },
        {
            title: <span className="font-bold">{"Cấp 4"}</span>,
            dataIndex: "level_4",
            width: '10%'
        },
        {
            title: <span className="font-bold">{"Cấp 5"}</span>,
            dataIndex: "level_5",
            width: '10%'
        },
    ];

    const getReport = async () => {
        try {
            const response: any = await getReportTBVTByOrg({ org_id: id })
            const blob = await response.blob();
            const fileURL = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute("download", "Báo cáo TBVT.docx");
            link.click();
        } catch (error) {
            console.log('error: ', error)
        }
    }
    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div className="bg-[white] flex flex-col">
            <div className="flex">
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
                        <BaseTable
                            hiddenIndex
                            className="overflow-auto"
                            isReloadButton={true}
                            dataSource={listToTree(tbvtCategories)}
                            columns={columns}
                            actionWidth={50}
                            pagination={false}
                            rowClassName="hover:bg-secondary group"
                            onChange={() => { }}
                            isAction={true}
                            rowKey={'id'}
                            btnCreate={false}
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

                )}
            </div>
        </div>
    );
}



