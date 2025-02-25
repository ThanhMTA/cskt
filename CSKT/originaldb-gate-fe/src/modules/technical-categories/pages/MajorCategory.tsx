import { PlusCircleOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { listToTree, makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { MAJOR_CATEGORY } from "../constants/MajorCategory.constant";
import { MajorCategoryData } from "../types/MajorCategory.types";
import { getMajorCategoryList, metaMajorCategory } from "../store/MajorCategory.action";
import MajorCategoryAction from "../components/MajorCategoryAction";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";



export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.Create,
    icon: <PlusCircleOutlined />,
    className: "border-none text-primary shadow-#0",
    title: "Thêm mới"
  },
];

export default function MajorCategory() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<MajorCategoryData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({})

  const COLUMNS: TableProps["columns"] = [
    {
      title: MAJOR_CATEGORY.NAME,
      dataIndex: "name",
      fixed: 'left',
      width: 150,
      key: TableGeneralKeys.Name,
      render: (text: string, record: MajorCategoryData) => {
        return (
          <span
            className="text-primary cursor-pointer font-semibold"
            onClick={() => {
              handleActions(Action.View, record)
            }}
          >{text}</span>
        )
      }
    },
    {
      title: MAJOR_CATEGORY.SHORT_NAME,
      dataIndex: "short_name",
      width: 150,
      key: TableGeneralKeys.ShortName,
    },
    // {
    //   title: MAJOR_CATEGORY.GROUP_ID,
    //   dataIndex: "group_id",
    //   width: 150,
    // },
    // {
    //   title: MAJOR_CATEGORY.PARENT_ID,
    //   dataIndex: "parent_id",
    //   width: 150,
    // },
    {
      title: MAJOR_CATEGORY.IS_ENABLE,
      dataIndex: "is_enable",
      width: 150,
      render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>

    },
    {
      title: MAJOR_CATEGORY.DESCRIPTION,
      dataIndex: "note",
      width: 380
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
          await getMajorCategoryList({ limit: pageSize, page }, filter),
          await metaMajorCategory(filter)
        ]
      );
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const handleActions = (key: Action, item: MajorCategoryData) => {
    // if (key === Action.View) {
    //   handleViewDetail(item);
    // }
    switch (key) {
      case Action.View:
        handleViewDetail(item);
        break;
      case Action.Create:
        openModalCreate(item.id);
        break;
    }
  }

  const openModalCreate = (id: string) => {
    openModal(
      <MajorCategoryAction
        parentId={id}
        action={Action.Create} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            reloadData();
          }
        },
      }
    )
  }
  const handleViewDetail = (item: MajorCategoryData) => {
    openModal(
      <MajorCategoryAction id={item.id} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <MajorCategoryAction id={item.id} action={Action.Update} />,
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

  //return
  return (
    <div className="w-[900px]">
      <BaseTable
        total={meta?.count || 0}
        className="mt-5"
        setFilter={setFilter}
        setPagination={setPagination}
        isReloadButton={false}
        dataSource={listToTree(dataSource)}
        columns={COLUMNS}
        actionList={ACTION_TABLE}
        rowClassName="hover:bg-secondary group"
        isAction={true}
        loading={isLoading}
        actionWidth={100}
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
            <MajorCategoryAction
              action={Action.Create} />,
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
