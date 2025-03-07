import BaseTable from "@app/components/BaseTable";
import { useModal } from "@app/contexts/ModalContext";
import CanBoAction from "../components/CanboCategoriesAction";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import { IMeta } from "@app/interfaces/common.interface";
// import { useEffect, useState } from "react";
import { useEffect, useMemo, useState } from "react";

import { getCanBo, metaCanBo } from "../store/CanBoCategories.action";
import { EyeOutlined } from "@ant-design/icons";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { CanBoCategoriesData } from "../types/CanBoCategories.types";
import { TableProps } from "antd/lib";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { getFullAddressString, listToTree, makeid } from "@app/core/helper";
import { Ward } from "@app/modules/it-categories/types/Ward.type";
import { RankCategoriesData } from "../types/RankCategories.types";
import { PositionCategoriesData } from "../types/PositionCategories.types";
import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
const ACTION_TABLE: ITableAction[] = [
    {
        key: Action.View,
        icon: <EyeOutlined />,
        tooltip: 'Chi tiết'
    },
];
export default function Page() {
    const { openModal } = useModal();
    const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
    const [data, setData] = useState<CanBoCategoriesData[]>([]);
    const [meta, setMeta] = useState<IMeta>({ count: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<any>({});

    const columns: TableProps['columns'] =useMemo( 
        ()=>
            [
        {
            title: "Họ tên",
            dataIndex: "name",
            fixed: 'left',
            key: TableGeneralKeys.Name,
            render: (value: any, record: CanBoCategoriesData) => {
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
            title: "SĐT",
            dataIndex: "SDT",
            key: "SDT",
        },
        {
            title: "Mã quân nhân",
            dataIndex: "code",
            key: "code",

        },
        {
            title: "Cấp bậc",
            dataIndex: "capbac_id",
            key: "capbac_id",
            // render: (item:RankCategoriesData) => item?.capbac_id?.name
            render: (item:RankCategoriesData) => item?.name

        },
        {
            title: "Chức vụ",
            dataIndex: "chucvu_id",
            key: "chucvu_id",
            // render: (_, item) => item?.chucvu_id?.name
            render: (item:PositionCategoriesData) => {
                // console.log("item:", item?.chucvu_id?.name); // Kiểm tra nội dung của item
                // return item?.chucvu_id?.name;
                return item?.name;

            }
        },

        {
            title: "Đơn vị",
            dataIndex: "donvi_id",
            key: "donvi_id",
            render: (item:OrganizationsData) => item?.name
        },
        {
            title: "Địa chỉ ",
            dataIndex: "ward_id",
            key: "ward_id",
            width: 300,
            render: (value: Ward) => getFullAddressString(value),
            // render: (_, item) => item?.diachi_id?.name
            // render: (_, item) => {
            //     const diachi = item?.diachi_id?.name;
            //     const huyen = item?.diachi_id?.district_id?.name;
            //     const tinh = item?.diachi_id?.district_id?. province_id?.name;
            //     return `${diachi || ""} ${huyen ? `- ${huyen}` : ""} ${tinh ? `- ${tinh}` : ""}`.trim();
            // }

        },
        {
            title: "Trạng thái",
            dataIndex: "is_enable",
            key: "is_enable",
            render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>
        },
    ]?.map((i) => {
        return {
          ...i,
          key: i?.key || makeid(),
        };
      }),
    []
  );
    const fetchData = async (page: number, pageSize: number, filter?: any) => {
        try {
            setIsLoading(true);
            const res = await Promise.all([getCanBo({ limit: pageSize, page }, filter), metaCanBo(filter)]);
            if (res[1]) {
                setMeta({ count: res[1].count })
            }
            setData(res[0])
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
    }


    const handleViewDetail = (item: CanBoCategoriesData) => {
        openModal(
            <CanBoAction id ={item.id} action={Action.View} />,
            {
                width: '50vw',
                onModalClose(res) {
                    if (res?.success) {
                        openModal(
                            <CanBoAction id ={item.id} action={Action.Update} />,
                            {
                                width: '50vw',
                                onModalClose() {
                                    reloadPage()
                                },
                            }
                        )
                    } else {
                        reloadPage();
                    }
                },
            }
        )
    }
    const handleActions = (key: Action, item: CanBoCategoriesData) => {
        console.log(key)
        if (key === Action.View) {
            handleViewDetail(item);
        }
    }
    const reloadPage = () => {
        fetchData(pagination.page, pagination.pageSize, filter)
    }
    useEffect(() => {
        fetchData(pagination.page, pagination.pageSize, filter)
    }, [filter])
    return <div className="w-[900px]">
        <BaseTable
            setFilter={setFilter}
            setPagination={setPagination}
            className="mt-5"
            isReloadButton={true}
            dataSource={[...data]}
            columns={columns}
            paginationCustom={
                {
                    current: pagination.page,
                    pageSize: pagination.pageSize,
                    total: meta?.count
                }
            }
            onChange={({ current, pageSize }: any) => {
                setPagination({ page: current, pageSize });
                fetchData(current, pageSize, filter);
            }}
            actionList={ACTION_TABLE}
            actionClick={handleActions}
            isAction={false}
            loading={isLoading}
            rowKey={'id'}
            filterColumns={[TableGeneralKeys.Name]}
            btnCreate={true}
            x={1400}
            handleCreate={() => {
                openModal(
                    <CanBoAction action={Action.Create} />,
                    {
                        width: '40vw',
                        onModalClose(res) {
                            if (res?.success) {
                                reloadPage();

                            }
                        },
                    }
                )
            }}
        />
    </div>
}