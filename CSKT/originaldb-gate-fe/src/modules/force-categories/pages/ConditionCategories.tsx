import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { getLabelSelect, makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { REASON_TYPE_FOR_OPTIONS } from "../constants/ReasonCategories.constant";
import { getConditionList, metaCondition } from "../store/CondittionCategories.action";
import { CONDITION_FIELD_NAME } from "../constants/ConditionCategories.constant";
import ConditionCategoriesAction from "../components/ConditionCategoriesAction";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { ConditionCategoriesData } from "../types/ConditionCategories.types";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function ConditionCategories() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<ConditionCategoriesData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<any>({})
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });

  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: CONDITION_FIELD_NAME.NAME,
      dataIndex: "name",
      width: 300,
      fixed: 'left',
      key: TableGeneralKeys.Name,
      render: (value: any, record: ConditionCategoriesData) => {
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
      title: CONDITION_FIELD_NAME.CODE,
      dataIndex: "code",
      width: 200
    },
    {
      title: CONDITION_FIELD_NAME.IS_ENABLE,
      dataIndex: "is_enable",
      width: 150,
      render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>

    },
    {
      title: CONDITION_FIELD_NAME.TYPE_FOR,
      dataIndex: "type_for",
      width: 150,
      render: (text: string) => {
        return <>{getLabelSelect(text, REASON_TYPE_FOR_OPTIONS)}</>
      }
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
          await getConditionList({ limit: pageSize, page }, filter),
          await metaCondition(filter)
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const handleActions = (key: Action, item: ConditionCategoriesData) => {
    if (key === Action.View) {
      handleViewDetail(item);
    }
  }
  const handleViewDetail = (item: ConditionCategoriesData) => {
    openModal(
      <ConditionCategoriesAction detail={item} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <ConditionCategoriesAction detail={item} action={Action.Update} />,
              {
                width: '40vw',
                onModalClose(res) {
                  if (res?.success) {
                    reloadPage();
                  } else {
                    reloadPage();
                  }
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
        // titleTable={`Quản lý danh mục ${FORCE_PAGE_LABEL.CONDITION}`}
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
            <ConditionCategoriesAction action={Action.Create} />,
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
    </>
  );
}
