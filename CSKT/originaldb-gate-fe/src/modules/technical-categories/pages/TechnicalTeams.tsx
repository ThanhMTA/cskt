import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { TechnicalTeamsData } from "../types/TechnicalTeams.types";
import { getTechnicalTeamsList, metaTechnicalTeams } from "../store/TechnicalTeams.action";
import TechnicalTeamsAction from "../components/TechnicalTeamsAction";
import { TECHNICAL_TEAM_FIELD_NAME } from "../constants/TechnicalTeams.constant";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";



export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: 'Chi tiết'
  },
];

export default function TechnicalTeams() {
  // variables
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<TechnicalTeamsData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({});

  //column
  const COLUMNS: TableProps["columns"] = [
    {
      title: TECHNICAL_TEAM_FIELD_NAME.NAME,
      dataIndex: "name",
      fixed: 'left',
      key: TableGeneralKeys.Name,
      render: (value: any, record: TechnicalTeamsData) => {
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
      title: TECHNICAL_TEAM_FIELD_NAME.SHORT_NAME,
      dataIndex: "short_name",
      key: TableGeneralKeys.ShortName
    },
    {
      title: TECHNICAL_TEAM_FIELD_NAME.IS_ENABLE,
      dataIndex: "is_enable",
      render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>

    },
    {
      title: TECHNICAL_TEAM_FIELD_NAME.ORG_ID,
      dataIndex: "org_id",
      render: (org: OrganizationsData) => org.name
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
      let custom_filter = {};
      if (Object.keys(filter).length > 0) {
        custom_filter = {
          org_id: {
            ...filter
          }
        };
      }
      setIsLoading(true);
      const response: any = await Promise.all(
        [
          await getTechnicalTeamsList({ limit: pageSize, page }, custom_filter),
          await metaTechnicalTeams(custom_filter)
        ]
      );
      console.log('response[0]: ', response[0])
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const handleViewDetail = (item: TechnicalTeamsData) => {
    openModal(
      <TechnicalTeamsAction detail={item} action={Action.View} />,
      {
        width: '40vw',
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <TechnicalTeamsAction detail={item} action={Action.Update} />,
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
        },
      }
    )
  }
  const handleActions = (key: Action, item: TechnicalTeamsData) => {
    console.log(key)
    if (key === Action.View) {
      handleViewDetail(item);
    }
  }

  const reloadData = () => {
    fetchData(pagination.page, pagination.pageSize, filter)
  }

  useEffect(() => {
    fetchData(pagination.page, pagination.pageSize, filter)
  }, [filter])

  //return
  return (
    <>
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
            <TechnicalTeamsAction action={Action.Create} />,
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
    </>
  );
}
