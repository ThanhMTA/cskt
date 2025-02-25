import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { makeid } from "@app/core/helper";
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
import {
  getDefenseLandsList,
  metaDefenseLands,
} from "../store/DefenseLands.action";
import DefenseLandsAction from "../components/DefenseLandsAction";
import { DEFENSE_LANDS_FIELDS_NAME } from "../constants/DefenseLands.constant";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { WorkstationsData } from "../types/Workstations.types";
import WorkstationsAction from "../components/WorkstationsAction";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: "Chi tiết",
  },
];

export default function DefenseLands() {
  const COLUMNS: TableProps["columns"] = [
    {
      title: DEFENSE_LANDS_FIELDS_NAME.NAME,
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
      title: DEFENSE_LANDS_FIELDS_NAME.SHORT_NAME,
      dataIndex: "symbol",
      width: 200,
      key: TableGeneralKeys.ShortName,
    },
    // {
    //   title: DEFENSE_LANDS_FIELDS_NAME.MANAGE_ORG_ID,
    //   dataIndex: "org_id",
    //   width: 200,
    // },
    // {
    //   title: DEFENSE_LANDS_FIELDS_NAME.WARD_ID,
    //   dataIndex: "ward_id",
    //   width: 200,
    // },
    {
      title: DEFENSE_LANDS_FIELDS_NAME.ADDRESS,
      dataIndex: "address",
      width: 300,
    },
    {
      title: DEFENSE_LANDS_FIELDS_NAME.AREA,
      dataIndex: "area",
      width: 300,
    },
    // {
    //   title: DEFENSE_LANDS_FIELDS_NAME.ALTITUDE,
    //   dataIndex: "altitude",
    //   width: 250,
    // },
    // {
    //   title: DEFENSE_LANDS_FIELDS_NAME.PHONE_NUMBER,
    //   dataIndex: "phone_number",
    //   width: 150,
    // },
    // {
    //   title: DEFENSE_LANDS_FIELDS_NAME.ID_EX,
    //   dataIndex: "id_ex",
    //   width: 250,
    // },
    // {
    //   title: DEFENSE_LANDS_FIELDS_NAME.CODE_EX,
    //   dataIndex: "code_ex",
    //   width: 200,
    // },
  ]?.map((i) => {
    return {
      ...i,
      key: i?.key || makeid(),
    };
  });
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
  // variables
  const { openModal, closeModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<DefenseLandsData[]>>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const modalType = useRef<Action>(Action.Create);
  const [isLoading, setIsLoading] = useState(false);
  // const pagination = useRef<ITablePagination>({ ...PAGINATION_TABLE_DEFAULT });
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
  }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({});

  // functions
  const fetchData = async (page: number, pageSize: number, filter: any) => {
    try {
      setIsLoading(true);
      const response: any = await Promise.all([
        await getDefenseLandsList({ limit: pageSize, page }, filter),
        await metaDefenseLands({}),
      ]);
      setDataSource(response[0]);
      setMeta(response[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getDetail = async (id: string) => {
    openModalCreate(id);
  };

  const openModalCreate = (id?: string) => {
    openModal(
      <DefenseLandsAction
        modalType={modalType?.current}
        idRecord={id}
        closeModal={(flag?: boolean) => {
          closeModal(true);
          if (flag) {
            reloadData();
          }
        }}
      />
    );
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
        dataSource={dataSource}
        columns={COLUMNS}
        actionList={ACTION_TABLE}
        isAction={true}
        loading={isLoading}
        setFilter={setFilter}
        setPagination={setPagination}
        // titleTable={`Quản lý danh mục ${OPERATION_CATEGORIES_PAGE_LABEL.DefenseLands}`}
        paginationCustom={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: meta?.count,
        }}
        onChange={({ current, pageSize }: any) => {
          setPagination({ page: current, pageSize });
          fetchData(current, pageSize, filter);
        }}
        actionClick={(key: Action, item: DefenseLandsData) => {
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
