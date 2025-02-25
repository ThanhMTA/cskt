import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { ZoneCategoryData } from "../types/ZoneCategory.types";
import { ZONE_CATEGORY } from "../constants/ZoneCategory.constant";
import { getZoneCategoryList, metaZoneCategory } from "../store/ZoneCategory.action";
import ZoneCategoryAction from "../components/ZoneCategoryAction";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";



export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function ZoneCategories() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<ZoneCategoryData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({})

  const COLUMNS: TableProps["columns"] = [
    {
      title: ZONE_CATEGORY.NAME,
      dataIndex: "name",
      fixed: 'left',
      key: TableGeneralKeys.Name,
      render: (value: any, record: ZoneCategoryData) => {
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
      title: ZONE_CATEGORY.CODE,
      dataIndex: "code",
    },
    {
      title: ZONE_CATEGORY.DESCRIPTION,
      dataIndex: "desc",
    },
    {
      title: ZONE_CATEGORY.IS_ENABLE,
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
          await getZoneCategoryList({ limit: pageSize, page }, filter),
          await metaZoneCategory(filter)
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const handleActions = (key: Action, item: ZoneCategoryData) => {
    switch (key) {
      case Action.View:
        handleViewDetail(item);
        break;
      case Action.Create:
        openModalCreate(item.id);
        break;
    }
  }

  const openModalCreate = (id: string) => {
    openModal(
      <ZoneCategoryAction
        id={id}
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
  }
  const handleViewDetail = (item: ZoneCategoryData) => {
    openModal(
      <ZoneCategoryAction id={item.id} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <ZoneCategoryAction id={item.id} action={Action.Update} />,
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
        isReloadButton={false}
        setFilter={setFilter}
        setPagination={setPagination}
        dataSource={dataSource}
        columns={COLUMNS}
        actionList={ACTION_TABLE}
        rowClassName="hover:bg-secondary"
        isAction={false}
        loading={isLoading}
        actionWidth={120}
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
            <ZoneCategoryAction
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
