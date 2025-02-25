import BaseTable from "@app/components/BaseTable";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import dayjs from "dayjs";
import { Action, FormatDate } from "@app/enums";
import { IMeta } from "@app/interfaces/common.interface";
import { SpliceClosuresData } from "../types/SpliceClosures.types";
import {
  getSpliceClosuresList,
  metaSpliceClosures,
} from "../store/SpliceClosures.action";
import SpliceClosuresAction from "../components/SpliceClosuresAction";
import {
  FiberLineTypeCategories,
  Organizations,
  ReasonCategories,
} from "@app/types/types";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import { getFullAddressString, makeid } from "@app/core/helper";
import { TableGeneralKeys } from "@app/enums/table.enum";

export default function SpliceClosures() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<SpliceClosuresData[]>>(
    []
  );
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
  }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({});
  //column
  const COLUMNS: TableProps["columns"] = [
    // {
    //   title: "Tên VTKT",
    //   dataIndex: "name",
    //   key: TableGeneralKeys.Name,
    //   fixed: "left",
    //   width: "200px",
    //   render: (value: string, record: SpliceClosuresData) => {
    //     return (
    //       <span
    //         className="font-semibold text-sm cursor-pointer text-[#3D73D0]"
    //         onClick={() => handleActions(Action.View, record)}
    //       >
    //         {value ?? ""}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   title: "Mã VTKT",
    //   dataIndex: "tbvt_id",
    //   render: (item: ReasonCategories) => {
    //     return item?.code;
    //   },
    // },
    // {
    //   title: "Tỉnh/TP, Quận/huyện, Phường xã",
    //   dataIndex: "ward_id",
    //   render: (value: string) => getFullAddressString(value),
    // },
    {
      fixed: "left",
      width: "200px",
      title: "Địa chỉ măng xông",
      key: "address",
      dataIndex: "address",
      render: (value: string, record: SpliceClosuresData) => {
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
      title: "Nguyên nhân hỏng",
      dataIndex: "reason",
      key: makeid(),
      // render: (item: ReasonCategories) => {
      //   return item?.name;
      // },
    },
    {
      title: "Đơn vị thực hiện",
      dataIndex: "repair_org_code_old",
      key: makeid(),
    },
    {
      title: "Mô tả",
      dataIndex: "desc",
    },
    // {
    //   title: "Thời điểm khắc phục",
    //   dataIndex: "repair_at",
    //   key: makeid(),
    //   render: (text: string) => {
    //     return dayjs(text).format(FormatDate.DayJSStandard);
    //   },
    // },
    // {
    //   title: "Vị trí măng xông",
    //   dataIndex: "repair_point",
    // },
    // {
    //   title: "Thuộc tuyến cáp",
    //   dataIndex: "fiber_line_id",
    //   key: makeid(),
    //   render: (item: FiberLineTypeCategories) => item?.name,
    // },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "is_enable",
    //   key: makeid(),
    //   render: (flag: boolean) =>
    //     flag ? (
    //       <span className="text-green-600">Hoạt động</span>
    //     ) : (
    //       <span className="text-red">Không hoạt động</span>
    //     ),
    // },
  ];

  // functions
  const fetchData = async (page: number, pageSize: number, filter: any) => {
    try {
      let custom_filter = {};
      if (filter?.address) {
        custom_filter = {
          address: filter?.address,
        };
      }
      delete filter?.address;
      if (Object.keys(filter).length > 0) {
        custom_filter = {
          tbvt_id: {
            ...filter,
          },
        };
      }
      setIsLoading(true);
      const response: any = await Promise.all([
        await getSpliceClosuresList({ limit: pageSize, page }, custom_filter),
        await metaSpliceClosures(custom_filter),
      ]);
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleViewDetail = (item: SpliceClosuresData) => {
    openModal(<SpliceClosuresAction detail={item} action={Action.View} />, {
      width: "45vw",
      onModalClose(res) {
        if (res?.success) {
          openModal(
            <SpliceClosuresAction detail={item} action={Action.Update} />,
            {
              width: "45vw",
              onModalClose() {
                reloadData();
              },
            }
          );
        } else {
          reloadData();
        }
      },
    });
  };
  const handleActions = (key: Action, item: SpliceClosuresData) => {
    switch (key) {
      case Action.View:
        handleViewDetail(item);
        break;
      case Action.Create:
        openModalCreate(item);
        break;
    }
  };
  const openModalCreate = (item: SpliceClosuresData) => {
    openModal(<SpliceClosuresAction detail={item} action={Action.Create} />, {
      width: "45vw",
      onModalClose(res) {
        if (res?.success) {
          reloadData();
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
        isReloadButton={true}
        dataSource={[...dataSource]}
        columns={COLUMNS}
        isAction={true}
        loading={isLoading}
        setFilter={setFilter}
        setPagination={setPagination}
        x={2000}
        paginationCustom={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: meta?.count,
        }}
        onChange={({ current, pageSize }: any) => {
          setPagination({ page: current, pageSize });
          fetchData(current, pageSize, filter);
        }}
        filterColumns={[TableGeneralKeys.Name, "address"]}
        actionClick={handleActions}
        btnCreate={true}
        handleCreate={() => {
          openModal(<SpliceClosuresAction action={Action.Create} />, {
            width: "45vw",
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
