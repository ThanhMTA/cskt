import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { TechnicalTeamsData } from "../types/TechnicalTeams.types";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { TECHNICAL_CATEGORY } from "../constants/TechnicalCategory.constant";
import { getTechnicalCategoryList, metaTechnicalCategory } from "../store/TechnicalCategory.action";
import TechnicalCategoryAction from "../components/TechnicalCategoryAction";
import { TechnicalCategoryData } from "../types/TechnicalCategory.types";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];
export default function TechnicalCategory() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<TechnicalTeamsData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<any>({})
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: TECHNICAL_CATEGORY.ORG_ID,
      dataIndex: "org_id",
      key: TableGeneralKeys.Name,
      render: (value: any, record: TechnicalCategoryData) => {
        return (
          <span
            className="font-semibold text-sm cursor-pointer text-[#3D73D0]"
            onClick={() => handleActions(Action.View, record)}
          >
            {value?.name ?? ""}
          </span>
        );
      },
    },
    {
      title: TECHNICAL_CATEGORY.CODE,
      dataIndex: "code",
      // render: (org: Organizations) => org.short_name
    },
    {
      title: TECHNICAL_CATEGORY.IS_ENABLE,
      dataIndex: "is_enable",
      render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>

    },
    {
      title: TECHNICAL_CATEGORY.DESCRIPTION,
      dataIndex: "note",
    },

  ]?.map(i => {
    return {
      ...i,
      key: i?.key || makeid()
    }
  });
  // functions
  const fetchData = async (
    page: number,
    pageSize: number,
    filter: any
  ) => {
    try {
      let custom_filter = {};
      if (Object.keys(filter).length > 0) {
        custom_filter = {
          org_id: {
            ...filter
          }
        };
      }
      setIsLoading(true);
      const response: any = await Promise.all(
        [
          await getTechnicalCategoryList({ limit: pageSize, page }, custom_filter),
          await metaTechnicalCategory(custom_filter)
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const handleActions = (key: Action, item: TechnicalCategoryData) => {
    if (key === Action.View) {
      handleViewDetail(item);
    }
  }
  const handleViewDetail = (item: TechnicalCategoryData) => {
    openModal(
      <TechnicalCategoryAction detail={item} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <TechnicalCategoryAction detail={item} action={Action.Update} />,
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

  //return
  return (
    <>
      <BaseTable
        total={meta?.count || 0}
        className="mt-5"
        setFilter={setFilter}
        setPagination={setPagination}
        isReloadButton={false}
        dataSource={dataSource}
        columns={COLUMNS}
        actionList={ACTION_TABLE}
        isAction={false}
        loading={isLoading}
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
        actionClick={handleActions}
        filterColumns={[TableGeneralKeys.Name]}
        btnCreate={true}
        handleCreate={() => {
          openModal(
            <TechnicalCategoryAction
              action={Action.Create} />,
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
    </>
  );
}
