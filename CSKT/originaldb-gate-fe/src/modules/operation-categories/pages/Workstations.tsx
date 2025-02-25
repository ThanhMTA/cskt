import { EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { listToTree, makeid } from "@app/core/helper";
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
import { DefenseLandsData } from "../types/DefenseLands.types";
import WorkstationsAction from "../components/WorkstationsAction";
import {
  getWorkstationsList,
  metaWorkstations,
} from "../store/Workstations.action";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { WorkstationsData } from "../types/Workstations.types";
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

export default function Workstations() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<DefenseLandsData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
  }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({});

  // table column
  const COLUMNS: TableProps["columns"] = [
    {
      title: "Tên",
      dataIndex: "name",
      fixed: "left",
      width: 300,
      key: TableGeneralKeys.Name,
      render: (text: string, record: WorkstationsData) => {
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
      title: "Ký hiện trạm",
      dataIndex: "symbol",
      width: 200,
      key: "symbol",
    },
    // {
    //   title: "Đia chỉ",
    //   dataIndex: "address",
    //   width: 120,
    // },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "is_enable",
    //   width: 150,
    //   render: (flag: boolean) => {
    //     return flag ? (
    //       <span className="text-green-600">Hoạt động</span>
    //     ) : (
    //       <span className="text-red">Không hoạt động</span>
    //     );
    //   },
    // },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      // width: 300,
    },
    {
      title: "SĐT",
      dataIndex: "phone_number",
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "date_created",
    //   width: 200,
    //   render: (text:string) => {
    //     return dayjs(text).format(FormatDate.DayJSStandard)
    //   }
    // }
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
        await getWorkstationsList({ limit: pageSize, page }, filter),
        await metaWorkstations({}),
      ]);
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (item: WorkstationsData) => {
    openModal(<WorkstationsAction detail={item} action={Action.View} />, {
      width: "80vw",
      onModalClose(res) {
        if (res?.success) {
          openModal(
            <WorkstationsAction detail={item} action={Action.Update} />,
            {
              width: "80vw",
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

  const handleActions = (key: Action, item: WorkstationsData) => {
    switch (key) {
      case Action.View:
        handleViewDetail(item);
        break;
      case Action.Create:
        // openModalCreate("", item);
        openModal(
          <WorkstationsAction parent_id={item?.id} action={Action.Create} />,
          {
            width: "80vw",
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
        setFilter={setFilter}
        // titleTable={`Quản lý ${OPERATION_CATEGORIES_PAGE_LABEL.Workstations}`}
        paginationCustom={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: meta?.count,
        }}
        setPagination={setPagination}
        onChange={({ current, pageSize }: any) => {
          setPagination({ page: current, pageSize });
          fetchData(current, pageSize, filter);
        }}
        rowClassName="hover:bg-secondary group"
        actionWidth={100}
        actionClick={handleActions}
        filterColumns={[TableGeneralKeys.Name, "symbol"]}
        btnCreate={true}
        handleCreate={() => {
          openModal(<WorkstationsAction action={Action.Create} />, {
            width: "80vw",
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
