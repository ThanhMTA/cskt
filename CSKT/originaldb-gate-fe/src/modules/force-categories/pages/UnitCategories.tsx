import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { UnitCategoriesData } from "../types/UnitCategories.types";
import { getUnitList, metaUnit } from "../store/UnitCategories.action";
import UnitCategoriesAction from "../components/UnitCategoriesAction";
import { UNIT_FIELD_NAME } from "../constants/UnitCategories.constant";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";


export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function UnitCategories() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<UnitCategoriesData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<any>({})
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });

  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: UNIT_FIELD_NAME.NAME,
      dataIndex: "name",
      fixed: 'left',
      width: 300,
      key: TableGeneralKeys.Name,
      render: (value: any, record: UnitCategoriesData) => {
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
      title: UNIT_FIELD_NAME.SHORT_NAME,
      dataIndex: "short_name",
      key: TableGeneralKeys.ShortName
    },
    {
      title: UNIT_FIELD_NAME.IS_ENABLE,
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
          await getUnitList({ limit: pageSize, page }, filter),
          await metaUnit(filter)
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }


  const handleViewDetail = (item: UnitCategoriesData) => {
    openModal(
      <UnitCategoriesAction detail={item} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <UnitCategoriesAction detail={item} action={Action.Update} />,
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

  const handleActions = (key: Action, item: UnitCategoriesData) => {
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
            <UnitCategoriesAction action={Action.Create} />,
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
