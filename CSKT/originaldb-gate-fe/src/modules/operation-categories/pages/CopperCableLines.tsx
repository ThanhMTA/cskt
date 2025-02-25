import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";

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

import {
  getOpticalFiberLinesList,
  metaOpticalFiberLines,
} from "../store/OpticalFiberLines.action";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { OpticalFiberLinesData } from "../types/OpticalFiberLines.types";
import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import { listToTree, makeid } from "@app/core/helper";
import { useLocation } from "react-router-dom";
import { CopperCableLinesData } from "../types/CopperCableLines.types";
import CopperCableFiberLinesAction from "../components/CopperCableLinesAction";

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: "Chi tiết",
  },
];

export default function CopperCableLines() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<FiberLineTypeData[]>>(
    []
  );
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const pagination = useRef<ITablePagination>({ ...PAGINATION_TABLE_DEFAULT });
  const location = useLocation();
  console.log(
    "pathname: ",
    location.pathname.split("/")[location.pathname.split("/").length - 1]
  );
  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: "Tên tuyến cáp",
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
      title: "Phân loại tuyến cáp",
      dataIndex: "type_id",
      width: 150,
      render: (value: any) => value?.name ?? "",
    },
    {
      title: "Đơn vị quản lý tuyến cáp",
      dataIndex: "org_manage_id",
      width: 300,
      render: (value: OrganizationsData) => value?.name ?? "",
    },
    {
      title: "Độ dài tuyến cáp",
      dataIndex: "length",
      width: 150,
    },
    {
      title: "Độ dài quản lý",
      dataIndex: "manage_length",
      width: 150,
    },

    {
      title: "Vị trí điểm đầu",
      dataIndex: "first_point",
      width: 150,
    },
    {
      title: "Vị trí điểm cuối",
      dataIndex: "final_point",
      width: 150,
    },
    {
      title: "Tổng số sợi",
      dataIndex: "number_of_fiber",
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
        await getOpticalFiberLinesList(
          { limit: pageSize, page },
          {
            type_id: {
              name: {
                _icontains: location.pathname
                  .split("/")
                  [location.pathname.split("/").length - 1].includes("quang")
                  ? "quang"
                  : "đồng",
              },
            },
          }
        ),
        await metaOpticalFiberLines({
          type_id: {
            name: {
              _icontains: location.pathname
                .split("/")
                [location.pathname.split("/").length - 1].includes("quang")
                ? "quang"
                : "đồng",
            },
          },
        }),
      ]);
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (item: CopperCableLinesData) => {
    openModal(<CopperCableFiberLinesAction detail={item} action={Action.View} />, {
      width: "40vw",
      onModalClose(res) {
        if (res?.success) {
          openModal(
            <CopperCableFiberLinesAction detail={item} action={Action.Update} />,
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
  const handleActions = (key: Action, item: OpticalFiberLinesData) => {
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
          openModal(<CopperCableFiberLinesAction action={Action.Create} />, {
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
