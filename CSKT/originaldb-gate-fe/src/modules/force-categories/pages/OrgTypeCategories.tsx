import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { OrgTypeCategoriesData } from "../types/OrgTypeCategories.types";
import { getOrgTypeList, metaOrgType } from "../store/OrgTypeCategories.action";
import { ORG_TYPE_FIELD_NAME } from "../constants/OrgTypeCategories.constant";
import OrgTypeCategoriesAction from "../components/OrgTypeCategoriesAction";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";



export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function OrgTypeCategories() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<OrgTypeCategoriesData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({})
  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: ORG_TYPE_FIELD_NAME.NAME,
      dataIndex: "name",
      fixed: 'left',
      width: 300,
      key: TableGeneralKeys.Name,
      render: (value: any, record: OrgTypeCategoriesData) => {
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
      title: ORG_TYPE_FIELD_NAME.CODE,
      dataIndex: "code",
      width: 200
    },
    {
      title: ORG_TYPE_FIELD_NAME.IS_ENABLE,
      dataIndex: "is_enable",
      width: 150,
      render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>

    },
    {
      title: ORG_TYPE_FIELD_NAME.DESC,
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
    pageSize: number,
    filter: any
  ) => {
    try {
      setIsLoading(true);
      const response: any = await Promise.all(
        [
          await getOrgTypeList({ limit: pageSize, page }, filter),
          await metaOrgType(filter)
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const handleActions = (key: Action, item: OrgTypeCategoriesData) => {
    if (key === Action.View) {
      handleViewDetail(item);
    }
  }
  const handleViewDetail = (item: OrgTypeCategoriesData) => {
    openModal(
      <OrgTypeCategoriesAction detail={item} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <OrgTypeCategoriesAction detail={item} action={Action.Update} />,
              {
                width: '40vw',
                onModalClose() {
                  reloadPage();
                },
              }
            )
          } else {
            reloadPage();
          }
        },
      }
    )
  }

  const reloadPage = () => {
    fetchData(pagination.page, pagination.pageSize, filter)
  }

  useEffect(() => {
    fetchData(pagination.page, pagination.pageSize, filter)
  }, [pagination, filter])

  //return
  return (
    <div className="w-[900px]">
      <BaseTable
        total={meta?.count || 0}
        className="mt-5"
        isReloadButton={false}
        setFilter={setFilter}
        setPagination={setPagination}
        dataSource={dataSource}
        columns={COLUMNS}
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
        handleCreate={() => {
          openModal(
            <OrgTypeCategoriesAction action={Action.Create} />,
            {
              width: '40vw',
              onModalClose(res) {
                if (res?.success) {
                  reloadPage();
                }
              },
            }
          )
        }}
      />
    </div>
  );
}
