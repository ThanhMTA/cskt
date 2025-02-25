import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { getLabelSelect, makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { REASON_FIELD_NAME, REASON_TYPE_FOR_OPTIONS } from "../constants/ReasonCategories.constant";
import { getReasonList, metaReason } from "../store/ReasonCategories.action";
import ReasonCategoriesAction from "../components/ReasonCategoriesAction";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { ReasonCategoriesData } from "../types/ReasonCategories.types";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function ReasonCategories() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<ReasonCategoriesData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<any>({})
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });

  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: REASON_FIELD_NAME.NAME,
      dataIndex: "name",
      fixed: 'left',
      key: TableGeneralKeys.Name,
      render: (value: any, record: ReasonCategoriesData) => {
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
      title: REASON_FIELD_NAME.CODE,
      dataIndex: "code",
      width: 300
    },
    {
      title: REASON_FIELD_NAME.TYPE_FOR,
      dataIndex: "type_for",
      render: (text: string) => {
        return <>{getLabelSelect(text, REASON_TYPE_FOR_OPTIONS)}</>
      }
    },
    {
      title: REASON_FIELD_NAME.IS_ENABLE,
      dataIndex: "is_enable",
      key: "is_enable",
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
          await getReasonList({ limit: pageSize, page }, filter),
          await metaReason(filter)
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const handleActions = (key: Action, item: ReasonCategoriesData) => {
    if (key === Action.View) {
      handleViewDetail(item);
    }
  }
  const handleViewDetail = (item: ReasonCategoriesData) => {
    openModal(
      <ReasonCategoriesAction detail={item} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <ReasonCategoriesAction detail={item} action={Action.Update} />,
              {
                width: '40vw',
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
        setFilter={setFilter}
        setPagination={setPagination}
        className="mt-5"
        isReloadButton={false}
        dataSource={dataSource}
        columns={COLUMNS}
        actionList={ACTION_TABLE}
        isAction={false}
        loading={isLoading}
        // titleTable={`Quản lý danh mục ${FORCE_PAGE_LABEL.REASON}`}
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
            <ReasonCategoriesAction action={Action.Create} />,
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
