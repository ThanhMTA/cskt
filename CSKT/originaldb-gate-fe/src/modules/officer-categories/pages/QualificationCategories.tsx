import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import QualificationCategoriesCreate from "../components/QualificationCategoriesCreate";
import { QualificationCategoriesData } from "../types/QualificationCategories.types";
import { getQualificationList, metaQualification } from "../store/QualificationCategories.action";
import { QualificationCategoriesDataKeys } from "../enums/QualificationCategories.enum";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { QUANLIFICATION_CATEGORIES_FIELD_NAME } from "../constants/QualificationCategories.constant";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";



export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function RankCategories() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<QualificationCategoriesData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({})
  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: "Tên trình độ học vấn",
      dataIndex: QualificationCategoriesDataKeys.Name,
      key: TableGeneralKeys.Name,
      fixed: "left",
      render: (value: any, record: QualificationCategoriesData) => {
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
      title: QUANLIFICATION_CATEGORIES_FIELD_NAME.SHORT_NAME,
      dataIndex: QualificationCategoriesDataKeys.ShortName,
      key: TableGeneralKeys.ShortName
    },
    {
      title: QUANLIFICATION_CATEGORIES_FIELD_NAME.CODE,
      dataIndex: QualificationCategoriesDataKeys.Code,
      key: QualificationCategoriesDataKeys.Code,
    },
    {
      title: QUANLIFICATION_CATEGORIES_FIELD_NAME.CODE_EX,
      dataIndex: QualificationCategoriesDataKeys.Code_ex,
      key: QualificationCategoriesDataKeys.Code_ex,
    },
    {
      title: QUANLIFICATION_CATEGORIES_FIELD_NAME.ID_EX,
      dataIndex: QualificationCategoriesDataKeys.Id_ex,
      key: QualificationCategoriesDataKeys.Id_ex,
    },
    {
      title: QUANLIFICATION_CATEGORIES_FIELD_NAME.IS_ENABLE,
      dataIndex: QualificationCategoriesDataKeys.Is_enable,
      render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>

    },
    {
      title: "Trạng thái",
      dataIndex: "is_enable",
      key: "is_enable",
      render: (flag: boolean) => {
        return flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>
      }
    }
  ]?.map(i => {
    return {
      ...i,
      key: i?.key || makeid()
    }
  });
  const fetchData = async (
    page: number,
    pageSize: number,
    filter: any
  ) => {
    try {
      setIsLoading(true);
      const response: any = await Promise.all(
        [
          await getQualificationList({ limit: pageSize, page }, filter),
          await metaQualification(filter)
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

  const handleViewDetail = (item: QualificationCategoriesData) => {
    openModal(
      <QualificationCategoriesCreate detail={item} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <QualificationCategoriesCreate detail={item} action={Action.Update} />,
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
  const handleActions = (key: Action, item: QualificationCategoriesData) => {
    if (key === Action.View) {
      handleViewDetail(item);
    }
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
        isReloadButton={false}
        dataSource={dataSource}
        columns={COLUMNS}
        actionList={ACTION_TABLE}
        isAction={false}
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
        x={1300}
        loading={isLoading}
        actionClick={handleActions}
        filterColumns={[TableGeneralKeys.Name]}
        btnCreate={true}
        handleCreate={() => {
          openModal(
            <QualificationCategoriesCreate action={Action.Create} />,
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
