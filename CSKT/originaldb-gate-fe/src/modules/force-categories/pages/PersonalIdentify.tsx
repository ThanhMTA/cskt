import { EyeOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { getLabelSelect, makeid } from "@app/core/helper";
import { Button, Flex, TableProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import dayjs from "dayjs";
import { Action, FormatDate } from "@app/enums";
import {
  ITableAction,
  ITablePagination,
} from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { PAGINATION_TABLE_DEFAULT } from "@app/constants/common.constant";
import { getPersonalIdentifyList, metaPersonalIdentify } from "../store/PersonalIdentify.action";
import { PersonalIdentifyData } from "../types/PersonalIdentify.types";
import PersonalIdentifyAction from "../components/PersonalIdentifyAction";
import { PERSONAL_IDENTIFY_TYPE_OPTIONS } from "../constants/PersonalIdentify.constant";
import { TableGeneralKeys } from "@app/enums/table.enum";

const COLUMNS: TableProps["columns"] = [
  {
    title: "Tên",
    dataIndex: "name",
    fixed: 'left',
    width: 200,
    key: TableGeneralKeys.Name
  },
  {
    title: "Tên viết tắt",
    dataIndex: "short_name",
    width: 200,
    key: TableGeneralKeys.ShortName
  },
  {
    title: "Mã định danh con người",
    dataIndex: "e_qn",
    width: 250,
  },
  {
    title: "Mã định danh công dân",
    dataIndex: "cccd",
    width: 250,
  },
  {
    title: "Số hiệu quân nhân",
    dataIndex: "military_code",
    width: 330,
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    width: 150,
    render: (flag: boolean) => {
      return flag ? "Nam" : "Nữ";
    },
  },
  {
    title: "Ngày sinh",
    dataIndex: "birthday",
    width: 200,
    render: (text: string) => {
      return dayjs(text).format(FormatDate.DayJSStandard);
    },
  },
  {
    title: "Đối tượng quân nhân",
    dataIndex: "type",
    width: 200,
    render: (value: any) => {
      return getLabelSelect(value, PERSONAL_IDENTIFY_TYPE_OPTIONS)
    }
  },
  {
    title: "Trạng thái",
    dataIndex: "is_enable",
    width: 150,
    render: (flag: boolean) => {
      return flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>
    },
  },
  // {
  //   title: "Ngày tạo",
  //   dataIndex: "date_created",
  //   width: 200,
  //   render: (text: string) => {
  //     return dayjs(text).format(FormatDate.DayJSStandard);
  //   },
  // },
]?.map((i) => {
  return {
    ...i,
    key: i?.key || makeid(),
  };
});

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.View,
    icon: <EyeOutlined />,
    tooltip: "Chi tiết",
  },
];

export default function PersonalIdentify() {
  // variables
  const { openModal, closeModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<PersonalIdentifyData[]>>(
    [],
  );
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const modalType = useRef<Action>(Action.Create);
  const [isLoading, setIsLoading] = useState(false);
  const pagination = useRef<ITablePagination>({ ...PAGINATION_TABLE_DEFAULT });

  // functions
  const fetchData = async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      const response: any = await Promise.all([
        await getPersonalIdentifyList({ limit: pageSize, page }, {}),
        await metaPersonalIdentify({}),
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
      <PersonalIdentifyAction
        modalType={modalType?.current}
        idRecord={id}
        closeModal={(flag?: boolean) => {
          closeModal(true);
          if (flag) {
            reloadData();
          }
        }}
      />,
    );
  };

  const reloadData = () => {
    fetchData(pagination.current.current, pagination.current.pageSize);
  };

  useEffect(() => {
    fetchData(pagination.current.current, pagination.current.pageSize);
  }, []);

  //return
  return (
    <>
      <BaseTable
        total={meta?.count || 0}
        className="mt-3"
        isReloadButton={false}
        dataSource={dataSource}
        columns={COLUMNS}
        actionList={ACTION_TABLE}
        isAction={true}
        loading={isLoading}
        paginationCustom={{
          ...pagination.current,
          total: meta?.count,
        }}
        onChange={({ current, pageSize }: any) => {
          pagination.current = { current, pageSize };
          fetchData(current, pageSize);
        }}
        actionClick={(key: Action, item: PersonalIdentifyData) => {
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
    </>
  );
}
