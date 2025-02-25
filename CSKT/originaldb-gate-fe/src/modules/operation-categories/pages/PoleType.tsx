import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction, ITablePagination } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { PAGINATION_TABLE_DEFAULT } from "@app/constants/common.constant";
import { PoleTypeData } from "../types/PoleType.types";
import { getPoleTypeList, metaPoleType } from "../store/PoleType.action";
import PoleTypeAction from "../components/PoleTypeAction";
import { TableGeneralKeys } from "@app/enums/table.enum";

const COLUMNS: TableProps["columns"] = [
  {
    title: "Tên loại cột",
    dataIndex: "name",
    fixed: "left",
    width: 300,
    key: TableGeneralKeys.Name
  },
  {
    title: "Mô tả",
    dataIndex: "desc",
    width: 200
  },
]?.map(i => {
  return {
    ...i,
    key: i?.key || makeid()
  }
});

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function PoleType() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<PoleTypeData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const pagination = useRef<ITablePagination>({ ...PAGINATION_TABLE_DEFAULT });

  // functions
  const fetchData = async (
    page: number,
    pageSize: number
  ) => {
    try {
      setIsLoading(true);
      const response: any = await Promise.all(
        [
          await getPoleTypeList({ limit: pageSize, page }, {}),
          await metaPoleType({})
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const handleActions = (key: Action, item: PoleTypeData) => {
    console.log(key)
    if (key === Action.View) {
      handleViewDetail(item);
    }
  }

  const handleViewDetail = (item: PoleTypeData) => {
    openModal(
      <PoleTypeAction detail={item} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <PoleTypeAction detail={item} action={Action.Update} />,
              {
                width: '40vw',
                onModalClose(res) {
                  if (res?.success) {
                    reloadData();
                  }
                },
              }
            )
          }
        },
      }
    )
  }
  const reloadData = () => {
    fetchData(
      pagination.current.current,
      pagination.current.pageSize
    );
  }

  useEffect(() => {
    fetchData(
      pagination.current.current,
      pagination.current.pageSize
    );
  }, [])

  //return
  return (
    <div className="w-[900px]">
      <BaseTable
        total={meta?.count || 0}
        className="mt-5"
        isReloadButton={false}
        dataSource={dataSource}
        columns={COLUMNS}
        actionList={ACTION_TABLE}
        isAction={true}
        loading={isLoading}
        // titleTable={`Quản lý danh mục ${OPERATION_CATEGORIES_PAGE_LABEL.PoleType}`}
        paginationCustom={
          {
            ...pagination.current,
            total: meta?.count
          }
        }
        onChange={({ current, pageSize }: any) => {
          pagination.current = { current, pageSize }
          fetchData(current, pageSize);
        }}
        actionClick={handleActions}
        filterColumns={[TableGeneralKeys.Name]}
        btnCreate={true}
        handleCreate={() => {
          openModal(
            <PoleTypeAction action={Action.Create} />,
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
