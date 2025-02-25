import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
import { Button, Flex, TableProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction, ITablePagination } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { PAGINATION_TABLE_DEFAULT } from "@app/constants/common.constant";
import { StationFunctionData } from "../types/StationFunction.types";
import { getStationFunctionList, metaStationFunction } from "../store/StationFunction.action";
import StationFunctionAction from "../components/StationFunctionAction";
import { TableGeneralKeys } from "@app/enums/table.enum";

const COLUMNS: TableProps["columns"] = [
  {
    title: "Tên chức năng trạm thông tin",
    dataIndex: "name",
    fixed: "left",
    width: 200,
    key: TableGeneralKeys.Name
  },
  {
    title: "Tên viết tắt",
    dataIndex: "short_name",
    key: TableGeneralKeys.ShortName,
    width: 150,
  },
]?.map(i => {
  return {
    ...i,
    key: i?.key || makeid()
  }
});

export const ACTION_TABLE:ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function StationFunction() {
  // variables
  const {openModal,closeModal} = useModal();
  const [dataSource, setDataSource] = useState<Partial<StationFunctionData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({count: 0});
  const modalType = useRef<Action>(Action.Create);
  const [isLoading, setIsLoading] = useState(false);
  const pagination = useRef<ITablePagination>({...PAGINATION_TABLE_DEFAULT});

  // functions
  const fetchData = async (
    page:number,
    pageSize:number
  ) => {
    try {
      setIsLoading(true);
      const response:any = await Promise.all(
        [
          await getStationFunctionList({ limit: pageSize, page }, {}),
          await metaStationFunction({})
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const getDetail = async (id:string) => {
    openModalCreate(id);
  }

  const openModalCreate = (
    id?:string
  ) => {
    openModal(
      <StationFunctionAction
        modalType={modalType?.current}
        idRecord={id}
        closeModal={(flag?:boolean) => {
          closeModal(true);
          if(flag){
            reloadData();
          }
        }}
      />
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
        // titleTable={`Quản lý danh mục ${OPERATION_CATEGORIES_PAGE_LABEL.StationFunction}`}
        paginationCustom={
          {
            ...pagination.current,
            total: meta?.count
          }
        }
        onChange={({current, pageSize}:any) => {
          pagination.current = {current, pageSize}
          fetchData(current, pageSize);
        }}
        actionClick={(key: Action, item: StationFunctionData) => {
          modalType.current = key;
          getDetail(item?.id);
        }}
        filterColumns={[TableGeneralKeys.Name]}
        btnCreate={true}
        handleCreate={() => {
          modalType.current = Action.Create;
          openModalCreate();
        }}
      />
    </div>
  );
}
