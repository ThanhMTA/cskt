import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction, ITablePagination } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { PAGINATION_TABLE_DEFAULT } from "@app/constants/common.constant";
import { getMajorList, metaMajor } from "../store/MajorCategories.action";
import { MajorCategoriesData } from "../types/MajorCategories.types";
import MajorCategoriesAction from "../components/MajorCategoriesAction";
import { MAJOR_FIELD_NAME } from "../constants/MajorCategories.constant";
import { TableGeneralKeys } from "@app/enums/table.enum";


export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function MajorCategories() {
  // variables
  const { openModal, closeModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<MajorCategoriesData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const modalType = useRef<Action>(Action.Create);
  const [isLoading, setIsLoading] = useState(false);
  const pagination = useRef<ITablePagination>({ ...PAGINATION_TABLE_DEFAULT });

  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: MAJOR_FIELD_NAME.NAME,
      dataIndex: "name",
      fixed: 'left',
      width: 300,
      key: TableGeneralKeys.Name,
      render: (value: any, record: MajorCategoriesData) => {
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
      title: MAJOR_FIELD_NAME.CODE,
      dataIndex: "code",
      width: 200,
    },
    {
      title: MAJOR_FIELD_NAME.DESC,
      dataIndex: "desc",
      width: 300
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
    pageSize: number
  ) => {
    try {
      setIsLoading(true);
      const response: any = await Promise.all(
        [
          await getMajorList({ limit: pageSize, page }, {}),
          await metaMajor({})
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const getDetail = async (id: string) => {
    openModalCreate(id);
  }

  const openModalCreate = (
    id?: string
  ) => {
    openModal(
      <MajorCategoriesAction
        modalType={modalType?.current}
        idPosition={id}
        closeModal={(flag?: boolean) => {
          closeModal(true);
          if (flag) {
            reloadData();
          }
        }}
      />
    )
  }
  const handleActions = (key: Action, item: MajorCategoriesData) => {
    console.log(key)
    if (key === Action.View) {
      getDetail(item.id);
    }
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
        isAction={false}
        loading={isLoading}
        // titleTable={`Quản lý danh mục ${FORCE_PAGE_LABEL.MAJOR}`}
        paginationCustom={
          {
            ...pagination.current,
            total: meta?.count
          }
        }
        onChange={({ current, pageSize }: any) => {
          pagination.current = { current, pageSize }
          fetchData(current, pageSize);
        }}
        actionClick={(key: Action, item: MajorCategoriesData) => {
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
