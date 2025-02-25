import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { PositionCategoriesData } from "../types/PositionCategories.types";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { getRankList, metaRank } from "../store/RankCategories.action";
import { RankCategoriesDataKeys } from "../enums/RankCategories.enum";
import { TableGeneralKeys } from "@app/enums/table.enum";
import RankCategoriesAction from "../components/RankCategoriesAction";
import { RANK_CATEGORIES_FIELD_NAME } from "../constants/RankCategories.constant";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";



export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function QualificationCategories() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<PositionCategoriesData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({})

  //column
  const columns: TableProps["columns"] = [
    {
      title: RANK_CATEGORIES_FIELD_NAME.NAME,
      dataIndex: RankCategoriesDataKeys.Name,
      key: TableGeneralKeys.Name,
      fixed: "left",
      render: (value: any, record: PositionCategoriesData) => {
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
      title: RANK_CATEGORIES_FIELD_NAME.SHORT_NAME,
      dataIndex: RankCategoriesDataKeys.ShortName,
      key: TableGeneralKeys.ShortName
    },
    {
      title: RANK_CATEGORIES_FIELD_NAME.CODE,
      dataIndex: RankCategoriesDataKeys.Code,
    },
    {
      title: RANK_CATEGORIES_FIELD_NAME.CODE_EX,
      dataIndex: RankCategoriesDataKeys.Code_ex,
    },
    {
      title: RANK_CATEGORIES_FIELD_NAME.ID_EX,
      dataIndex: RankCategoriesDataKeys.Id_ex,
    },
    {
      title: RANK_CATEGORIES_FIELD_NAME.IS_ENABLE,
      dataIndex: "is_enable",
      render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>

    },
  ]?.map(i => {
    return {
      ...i,
      key: i?.key || makeid()
    }
  });
  const fetchData = async (
    page: number,
    pageSize: number,
    filter: any
  ) => {
    try {
      setIsLoading(true);
      const response: any = await Promise.all(
        [
          await getRankList({ limit: pageSize, page }, filter),
          await metaRank(filter)
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  const handleActions = (key: Action, item: PositionCategoriesData) => {
    if (key === Action.View) {
      handleViewDetail(item);
    }
  }
  const handleViewDetail = (item: PositionCategoriesData) => {
    openModal(
      <RankCategoriesAction detail={item} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <RankCategoriesAction detail={item} action={Action.Update} />,
              {
                width: '40vw',
                onModalClose() {
                  reloadData();
                },
              }
            )
          } else {
            reloadData();
          }
        },
      }
    )
  }

  const reloadData = () => {
    fetchData(pagination.page, pagination.pageSize, filter)
  }

  useEffect(() => {
    fetchData(pagination.page, pagination.pageSize, filter)
  }, [pagination, filter])
  return (
    <div className="w-[900px]">
      <BaseTable
        total={meta?.count || 0}
        setFilter={setFilter}
        setPagination={setPagination}
        className="mt-5"
        isReloadButton={false}
        dataSource={dataSource}
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
        x={1300}
        actionList={ACTION_TABLE}
        isAction={false}
        loading={isLoading}
        actionClick={handleActions}
        filterColumns={[TableGeneralKeys.Name]}
        btnCreate={true}
        handleCreate={() => {
          openModal(
            <RankCategoriesAction action={Action.Create} />,
            {
              width: '40vw',
              onModalClose(res) {
                if (res?.success) {
                  reloadData();
                }
              },
            }
          )
        }}
      />
    </div>
  );
}
