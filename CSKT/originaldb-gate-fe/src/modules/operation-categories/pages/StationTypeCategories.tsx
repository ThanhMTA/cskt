import { PlusCircleOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { getLabelIsEnable, listToTree, makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import {
  ITableAction,
  ITablePagination,
} from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { PAGINATION_TABLE_DEFAULT } from "@app/constants/common.constant";
import { StationTypeData } from "../types/StationType.types";
import {
  getStationTypeList,
  metaStationType,
} from "../store/StationType.action";
import StationTypeAction from "../components/StationTypeAction";
import { STATION_TYPE_FIELDS_NAME } from "../constants/StationType.constant";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";

export const ACTION_TABLE: ITableAction[] = [
  // {
  //   key: Action.View,
  //   icon: <EyeOutlined />,
  //   tooltip: 'Chi tiết'
  // },
  {
    key: Action.Create,
    icon: <PlusCircleOutlined />,
    className: "border-none text-primary shadow-#0",
    title: "Thêm mới",
  },
];

export default function StationType() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<StationTypeData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
  }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({});

  // Table column
  const COLUMNS: TableProps["columns"] = [
    {
      title: STATION_TYPE_FIELDS_NAME.NAME,
      dataIndex: "name",
      fixed: "left",
      width: 200,
      key: TableGeneralKeys.Name,
      render: (text: string, record: StationTypeData) => {
        return (
          <span
            className="text-primary cursor-pointer font-semibold"
            onClick={() => {
              handleViewDetail(record);
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: STATION_TYPE_FIELDS_NAME.PARENT_ID,
      dataIndex: "parent",
      width: 300,
      render: (value: StationTypeData) => value?.name || "---",
    },
    {
      title: STATION_TYPE_FIELDS_NAME.IS_ENABLE,
      dataIndex: "is_enable",
      width: 150,
      render: (flag: boolean) =>
        flag ? (
          <span className="text-green-600">Hoạt động</span>
        ) : (
          <span className="text-red">Không hoạt động</span>
        ),
    },
  ]?.map((i) => {
    return {
      ...i,
      key: i?.key || makeid(),
    };
  });
  // functions
  const fetchData = async (page: number, pageSize: number, filter: any) => {
    try {
      setIsLoading(true);
      const response: any = await Promise.all([
        await getStationTypeList({ limit: pageSize, page }, filter),
        await metaStationType({}),
      ]);
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (item: StationTypeData) => {
    openModal(<StationTypeAction detail={item} action={Action.View} />, {
      width: "40vw",
      onModalClose(res) {
        if (res?.success) {
          openModal(
            <StationTypeAction detail={item} action={Action.Update} />,
            {
              width: "40vw",
              onModalClose(res) {
                if (res?.success) {
                  reloadData();
                }
              },
            }
          );
        }
      },
    });
  };
  const handleActions = (key: Action, item: StationTypeData) => {
    switch (key) {
      case Action.View:
        handleViewDetail(item);
        break;
      case Action.Create:
        // openModalCreate("", item);
        openModal(
          <StationTypeAction parent_id={item?.id} action={Action.Create} />,
          {
            width: "40vw",
            onModalClose(res) {
              if (res?.success) {
                reloadData();
              }
            },
          }
        );
        break;
    }
  };

  const reloadData = () => {
    fetchData(pagination.page, pagination.pageSize, filter);
  };

  useEffect(() => {
    fetchData(pagination.page, pagination.pageSize, filter);
  }, [filter]);

  //return
  return (
    <div className="w-[900px]">
      <BaseTable
        total={meta?.count || 0}
        className="mt-5"
        isReloadButton={false}
        dataSource={listToTree(dataSource)}
        columns={COLUMNS}
        actionList={ACTION_TABLE}
        isAction={true}
        loading={isLoading}
        setPagination={setPagination}
        setFilter={setFilter}
        // titleTable={`Quản lý danh mục ${OPERATION_CATEGORIES_PAGE_LABEL.StationType}`}
        paginationCustom={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: meta?.count,
        }}
        onChange={({ current, pageSize }: any) => {
          setPagination({ page: current, pageSize });
          fetchData(current, pageSize, filter);
        }}
        actionClick={handleActions}
        filterColumns={[TableGeneralKeys.Name]}
        btnCreate={true}
        handleCreate={() => {
          openModal(<StationTypeAction action={Action.Create} />, {
            width: "40vw",
            onModalClose(res) {
              if (res?.success) {
                reloadData();
              }
            },
          });
        }}
      />
    </div>
  );
}
