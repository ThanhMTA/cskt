import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
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
import { DrainTanksData } from "../types/DrainTanks.types";
import { getDrainTanksList, metaDrainTanks } from "../store/DrainTanks.action";
import DrainTanksAction from "../components/DrainTanksAction";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: "Chi tiết",
  },
];

export default function DrainTanks() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<DrainTanksData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
  }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({});
  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: "Tên cống, bể",
      dataIndex: "name",
      width: 200,
      fixed: "left",
      key: TableGeneralKeys.Name,
      render: (value: any, record: DrainTanksData) => {
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
      title: "Vị trí đặt cống, bể",
      dataIndex: "address",
      width: 300,
    },
    {
      title: "Đơn vị quản lý",
      dataIndex: "org_id",
      width: 330,
    },
    {
      title: "Loại cống bể",
      dataIndex: "type_id",
      width: 330,
    },
    {
      title: "Địa bàn",
      dataIndex: "ward_id",
      width: 330,
    },
    {
      title: "Trạng thái",
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
        await getDrainTanksList({ limit: pageSize, page }, filter),
        await metaDrainTanks({}),
      ]);
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (item: DrainTanksData) => {
    openModal(<DrainTanksAction detail={item} action={Action.View} />, {
      width: "40vw",
      onModalClose(res) {
        if (res?.success) {
          openModal(<DrainTanksAction detail={item} action={Action.Update} />, {
            width: "40vw",
            onModalClose(res) {
              if (res?.success) {
                reloadData();
              }
            },
          });
        }
      },
    });
  };
  const handleActions = (key: Action, item: DrainTanksData) => {
    console.log(key);
    if (key === Action.View) {
      handleViewDetail(item);
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
        dataSource={dataSource}
        columns={COLUMNS}
        actionList={ACTION_TABLE}
        isAction={false}
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
          openModal(<DrainTanksAction action={Action.Create} />, {
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
