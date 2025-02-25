import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { getLabelIsEnable, makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import dayjs from "dayjs";
import { Action, FormatDate } from "@app/enums";
import {
  ITableAction,
  ITablePagination,
} from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { PAGINATION_TABLE_DEFAULT } from "@app/constants/common.constant";
import { MobileVehiclesData } from "../types/MobileVehicles.types";
import {
  getMobileVehiclesList,
  metaMobileVehicles,
} from "../store/MobileVehicles.action";
import MobileVehiclesAction from "../components/MobileVehiclesAction";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import { Country } from "@app/modules/it-categories/types/Country.type";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: "Chi tiết",
  },
];

export default function MobileVehicles() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<MobileVehiclesData[]>>(
    []
  );
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
  }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({});
  // column

  const COLUMNS: TableProps["columns"] = [
    {
      title: "Tên xe cơ động",
      dataIndex: "name",
      fixed: "left",
      width: 200,
      key: TableGeneralKeys.Name,
      render: (value: any, record: MobileVehiclesData) => {
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
      title: "Mã TBVT",
      dataIndex: "code",
      width: 200,
      render: (value: string) => value || "---",
    },
    {
      title: "Biển số xe",
      dataIndex: "serial_number",
      width: 200,
    },
    {
      title: "Đơn vị quản lý",
      dataIndex: "org_id",
      width: 330,
      render: (value: OrganizationsData) => value?.name ?? "",
    },
    {
      title: "Xuất xứ",
      dataIndex: "origin_id",
      width: 330,
      render: (value: Country) => value?.name ?? "",
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
    {
      title: "Mã định danh",
      dataIndex: "eid",
      width: 200,
    },
    {
      title: "Ngày đưa vào sử dụng",
      dataIndex: "used_at",
      width: 200,
      render: (text: string) => {
        return dayjs(text).format(FormatDate.DayJSStandard);
      },
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
        await getMobileVehiclesList({ limit: pageSize, page }, filter),
        await metaMobileVehicles({}),
      ]);
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleActions = (key: Action, item: MobileVehiclesData) => {
    console.log(key);
    if (key === Action.View) {
      handleViewDetail(item);
    }
  };
  const handleViewDetail = (item: MobileVehiclesData) => {
    openModal(<MobileVehiclesAction detail={item} action={Action.View} />, {
      width: "40vw",
      onModalClose(res) {
        if (res?.success) {
          openModal(
            <MobileVehiclesAction detail={item} action={Action.Update} />,
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
        // titleTable={`Quản lý ${OPERATION_CATEGORIES_PAGE_LABEL.MobileVehicles}`}
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
          openModal(<MobileVehiclesAction action={Action.Create} />, {
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
