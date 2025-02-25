import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import {  makeid } from "@app/core/helper";
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
import { FiberLineTypeData } from "../types/FiberLineType.types";
import MicrowaveLinesAction from "../components/MicrowaveLinesAction";
import {
  getMicrowaveLinesList,
  metaMicrowaveLines,
} from "../store/MicrowaveLines.action";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { MicrowaveLinesData } from "../types/MicrowaveLines.types";
import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: "Chi tiết",
  },
];

export default function MicrowaveLines() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<FiberLineTypeData[]>>(
    []
  );
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const pagination = useRef<ITablePagination>({ ...PAGINATION_TABLE_DEFAULT });

  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: "Tên tuyến",
      dataIndex: "name",
      width: 200,
      fixed: "left",
      key: TableGeneralKeys.Name,
      render: (value: any, record: FiberLineTypeData) => {
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
      title: "Ký hiệu",
      dataIndex: "symbol",
      width: 150,
      render: (value: any) => value ?? "",
    },
    {
      title: "Đơn vị quản lý",
      dataIndex: "org_manage_id",
      width: 300,
      render: (value: OrganizationsData) => value?.name ?? "",
    },
    {
      title: "Cự ly",
      dataIndex: "distance",
      width: 150,
    },
    {
      title: "Tần số thu",
      dataIndex: "receiving_frequency",
      width: 150,
    },
    {
      title: "Loại thiết bị",
      dataIndex: "type",
      width: 150,
    },
    {
      title: "Loại điều chế",
      dataIndex: "modulation_type",
      width: 150,
    },
    {
      title: "Phân cực",
      dataIndex: "polarization_type",
      width: 150,
    },
    {
      title: "Mức suy hao",
      dataIndex: "depreciation_rate",
      width: 150,
    },
    {
      title: "Dung lượng hệ thống",
      dataIndex: "capacity",
      width: 150,
    },
    {
      title: "Vị trí điểm đầu",
      dataIndex: "longitude",
      width: 150,
    },
    {
      title: "Vị trí điểm cuối",
      dataIndex: "latitude",
      width: 150,
    },
  
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 150,
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
  const fetchData = async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      const response: any = await Promise.all([
        await getMicrowaveLinesList({ limit: pageSize, page }, {}),
        await metaMicrowaveLines({}),
      ]);
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (item: MicrowaveLinesData) => {
    openModal(<MicrowaveLinesAction detail={item} action={Action.View} />, {
      width: "40vw",
      onModalClose(res) {
        if (res?.success) {
          openModal(
            <MicrowaveLinesAction detail={item} action={Action.Update} />,
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
  const handleActions = (key: Action, item: MicrowaveLinesData) => {
    console.log(key);
    if (key === Action.View) {
      handleViewDetail(item);
    }
  };
  const reloadData = () => {
    fetchData(pagination.current.current, pagination.current.pageSize);
  };

  useEffect(() => {
    fetchData(pagination.current.current, pagination.current.pageSize);
  }, []);

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
        // titleTable={`Quản lý ${OPERATION_CATEGORIES_PAGE_LABEL.OpticalFiberLines}`}
        paginationCustom={{
          ...pagination.current,
          total: meta?.count,
        }}
        onChange={({ current, pageSize }: any) => {
          pagination.current = { current, pageSize };
          fetchData(current, pageSize);
        }}
        actionClick={handleActions}
        filterColumns={[TableGeneralKeys.Name]}
        btnCreate={true}
        handleCreate={() => {
          openModal(<MicrowaveLinesAction action={Action.Create} />, {
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
