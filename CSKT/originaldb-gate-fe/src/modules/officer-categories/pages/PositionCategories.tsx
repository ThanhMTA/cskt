import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { getPositionList, metaPosition } from "../store/PositionCategories.action";
import { useModal } from "@app/contexts/ModalContext";
import PositionCategoriesCreate from "../components/PositionCategoriesCreate";
import { PositionCategoriesData } from "../types/PositionCategories.types";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { PositionCategoriesDataKeys } from "../enums/PositionCategories.enum";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { POSITION_CATEGORIES_FIELD_NAME } from "../constants/PositionCategories.constant";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";


export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function PositionCategories() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<PositionCategoriesData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({})

  //column
  const columns: TableProps["columns"] = [
    {
      title: POSITION_CATEGORIES_FIELD_NAME.NAME,
      dataIndex: PositionCategoriesDataKeys.Name,
      key: TableGeneralKeys.Name,
      fixed: "left",
      render: (value: any, record: PositionCategoriesData) => {
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
      title: POSITION_CATEGORIES_FIELD_NAME.SHORT_NAME,
      dataIndex: PositionCategoriesDataKeys.ShortName,
      key: TableGeneralKeys.ShortName
    },
    {
      title: POSITION_CATEGORIES_FIELD_NAME.CODE,
      dataIndex: PositionCategoriesDataKeys.Code,
      key: PositionCategoriesDataKeys.Code
    },
    {
      title: POSITION_CATEGORIES_FIELD_NAME.CODE_EX,
      dataIndex: PositionCategoriesDataKeys.Code_ex,
      key: PositionCategoriesDataKeys.Code_ex
    },
    {
      title: POSITION_CATEGORIES_FIELD_NAME.ID_EX,
      dataIndex: PositionCategoriesDataKeys.Id_ex,
      key: PositionCategoriesDataKeys.Id_ex
    },
    {
      title: "Trạng thái",
      dataIndex: "is_enable",
      key: "is_enable",
      render: (flag: boolean) => {
        return flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>
      }
    }
  ];
  const fetchData = async (
    page: number,
    pageSize: number,
    filter: any
  ) => {
    try {
      setIsLoading(true);
      const response: any = await Promise.all(
        [
          await getPositionList({ limit: pageSize, page }, filter),
          await metaPosition(filter)
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }
  const handleActions = (key: Action, item: PositionCategoriesData) => {
    if (key === Action.View) {
      handleViewDetail(item);
    }
  }
  const handleViewDetail = (item: PositionCategoriesData) => {
    openModal(
      <PositionCategoriesCreate detail={item} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <PositionCategoriesCreate detail={item} action={Action.Update} />,
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
  return (
    <div className="w-[900px]">
      <BaseTable
        total={meta?.count || 0}
        className="mt-5"
        setFilter={setFilter}
        setPagination={setPagination}
        isReloadButton={false}
        dataSource={dataSource}
        columns={columns}
        actionList={ACTION_TABLE}
        isAction={false}
        loading={isLoading}
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
        x={1300}
        handleCreate={() => {
          openModal(
            <PositionCategoriesCreate action={Action.Create} />,
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
    </div>
  );
}
