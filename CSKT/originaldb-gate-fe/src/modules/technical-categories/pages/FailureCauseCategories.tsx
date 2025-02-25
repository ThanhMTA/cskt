import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { FailureCauseCategoriesData } from "../types/FailureCauseCategories.types";
import { getFailureCauseList, metaFailureCause } from "../store/FailureCauseCategories.action";
import FailureCauseCategoriesAction from "../components/FailureCauseCategoriesAction";
import { FAILURE_CAUSE_FIELD_NAME } from "../constants/FailureCause.constant";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function FailureCauseCategories() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<FailureCauseCategoriesData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({})

  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: FAILURE_CAUSE_FIELD_NAME.NAME,
      dataIndex: "name",
      fixed: 'left',
      width: 300,
      key: TableGeneralKeys.Name,
      render: (value: any, record: FailureCauseCategoriesData) => {
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
      title: FAILURE_CAUSE_FIELD_NAME.SHORT_NAME,
      dataIndex: "short_name",
      key: TableGeneralKeys.ShortName
    },
    {
      title: FAILURE_CAUSE_FIELD_NAME.IS_ENABLE,
      dataIndex: "is_enable",
      render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>

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
      setIsLoading(true);
      const response: any = await Promise.all(
        [
          await getFailureCauseList({ limit: pageSize, page }, filter),
          await metaFailureCause(filter)
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }


  const handleActions = (key: Action, item: FailureCauseCategoriesData) => {
    console.log(key)
    if (key === Action.View) {
      handleViewDetail(item);
    }
  }
  const handleViewDetail = (item: FailureCauseCategoriesData) => {
    openModal(
      <FailureCauseCategoriesAction detail={item} action={Action.View} />,
      {
        width: '45vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <FailureCauseCategoriesAction detail={item} action={Action.Update} />,
              {
                width: '45vw',
                onModalClose() {
                  reloadPage();
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
  const reloadPage = () => {
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
            <FailureCauseCategoriesAction action={Action.Create} />,
            {
              width: '45vw',
              onModalClose(res) {
                if (res?.success) {
                  reloadPage();

                }
              },
            }
          )
        }}
      />
    </>
  );
}
