import {
  MinusOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { listToTree, makeid } from "@app/core/helper";
import { TableProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { IMeta } from "@app/interfaces/common.interface";
import { OrganizationsData } from "../types/Organizations.types";
import {
  getOrganizationsList, 
  metaOrganizations
} from "../store/Organizations.action";
// import OrganizationsAction from "../components/OrganizationsAction";
import OrganizationsAction from "../components/OrganizationsAction";
import { ORGANIZATIONS_FIELD_NAME } from "../constants/Organizations.constant";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { useLocation } from "react-router-dom";
import { RouterUrl } from "@app/enums/router.enum";
import { OrganizationsMaxLength } from "../enums/Organizations.enum";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";

export const ACTION_TABLE: ITableAction[] = [
  {
    key: Action.Create,
    icon: <PlusCircleOutlined />,
    className: "text-primary",
    title: "Thêm mới",
  },
];

export default function Organizations(props: any) {
  // variables
  const { pathname } = useLocation();
  const { openModal } = useModal();
  const [dataSource, setDataSource] = useState<Partial<OrganizationsData[]>>(
    []
  );
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
  }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [filter, setFilter] = useState<any>({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const COLUMNS: TableProps["columns"] = useMemo(
    () =>
      [
        {
          title: ORGANIZATIONS_FIELD_NAME.CODE,
          dataIndex: "code",
          render: (value: string, record: OrganizationsData) => {
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
          title: ORGANIZATIONS_FIELD_NAME.NAME,
          dataIndex: "name",
          key: TableGeneralKeys.Name,
        },
        // {
        //   title: ORGANIZATIONS_FIELD_NAME.UNIT,
        //   dataIndex: "unit",
        //   //width: 330,
        //   render: (unit: any) => unit,
        // },
      ]?.map((i) => {
        return {
          ...i,
          key: i?.key || makeid(),
        };
      }),
    []
  );
  // let type = "";
  // switch ("/" + pathname.split("/")[1]) {
  //   case RouterUrl.ForceCategories:
  //     type = OrganizationsType.TB;
  //     break;
  //   case RouterUrl.LogisticsCategories:
  //     type = OrganizationsType.HC;
  //     break;
  //   case RouterUrl.PoliticsCategories:
  //     type = OrganizationsType.CT;
  //     break;
  //   case RouterUrl.TechnicalCategories:
  //     type = OrganizationsType.VT;
  //     break;
  //   default:
  //     break;
  // }
  // functions
  const fetchData = async (page: number, pageSize: number, filter: any) => {
    try {
      setIsLoading(true);
      let initFilter = {};
      if (JSON.stringify(filter) === "{}") {
        initFilter = { parent_id: { _null: true } };
      }
      const response: any = await Promise.all([
        await getOrganizationsList({ limit: -1 }, { ...filter, ...initFilter }),
        await metaOrganizations(filter),
      ]);
      // setDataSource(response[0]);
      setDataSource((prevData) => {
        // console.log("Giá trị trước đó của dataSource:", prevData);
        return [...response[0]]; // Tạo một mảng mới để React nhận diện thay đổi
      });
      setMeta(response[1]);
      setIsLoading(false);
      // console.log("danh sach don vi",dataSource)
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchChildData = async (parentId: string) => {
    // Check if there are already items with the same parentId


    const hasChildData = dataSource.some(
      (item: any) => item.parent_id === parentId
    );
    console.log("danh sach don vi con",hasChildData )


    if (hasChildData) {
      return; // Do not call API if child data already exists
    }

    try {
      setIsLoading(true);
      const response =  await getOrganizationsList({ limit: -1 },  { parent_id: parentId },)

      setDataSource([...dataSource, ...response]);
      console.log('chill',response )
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (item: OrganizationsData) => {
    openModal(
      <OrganizationsAction 
      // type={type}
      
      action={Action.View}
      detail={item}
      parent_id="1"
      dataSource={dataSource}
      setDataSource={setDataSource}
       />,

      {
        width: "50vw",
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <OrganizationsAction 
              // detail={item} action={Action.Update}
              // type={type}
              detail={item}
              action={Action.Update}
              dataSource={dataSource}
              setDataSource={setDataSource}
               />,
          
              {
                width: "50vw",
                onModalClose(res) {
                  if (res?.success) {
                    // reloadPage();
                  } else {
                    // reloadPage();
                  }
                },
              }
            );
          } else {
            // reloadPage();
          }
        },
      }
    );
  };

  const handleActions = (key: Action, item: OrganizationsData) => {
    switch (key) {
      case Action.View:
        handleViewDetail(item);
        break;
      case Action.Create:
        openModal(
          <OrganizationsAction
          dataSource={dataSource}
          setDataSource={setDataSource}
          // type={type}
          parent_id={item?.id}
          action={Action.Create} 
           />,
       
          {
            width: "50vw",
            onModalClose(res) {},
          }
        );
    }
  };

  const reloadPage = () => {
    fetchData(pagination.page, pagination.pageSize, filter);
  };

  useEffect(() => {
    fetchData(pagination.page, pagination.pageSize, filter);
  }, [pagination, filter]);
  //return
  return (
    <div className="w-[900px]" >
      <BaseTable
        hiddenIndex
        total={meta?.count || 0}
        className="mt-5"
        {...props}
        setFilter={setFilter}
        setPagination={setPagination}
        isReloadButton={false}
        dataSource={listToTree(dataSource)}
        columns={COLUMNS}
        actionList={ACTION_TABLE}
        isAction={true}
        actionWidth={100}
        rowClassName="hover:bg-secondary group"
        loading={isLoading}
        pagination={false}
        paginationCustom={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: meta?.count,
        }}
        onChange={({ current, pageSize }: any) => {
          setPagination({ page: current, pageSize });
          fetchData(current, pageSize, filter);
        }}
        actionClick={(key: Action, item: OrganizationsData) =>
          handleActions(key, item)
        }
        filterColumns={[TableGeneralKeys.Name]}
        btnCreate={true}
        handleCreate={() => {
          openModal(
            <OrganizationsAction
            // type={type}
            action={Action.Create}
            dataSource={dataSource}
            setDataSource={setDataSource}
             />,
   
            {
              width: "50vw",
              onModalClose(res) {
                // if (res?.success) {
                //   reloadPage();
                // }
              },
            }
          );
        }}
        expandable={{
          expandedRowKeys: expandedRowKeys,
          onExpand: (expanded, record) => {
            if (expanded) {
              fetchChildData(record.id);
              setExpandedRowKeys([...expandedRowKeys, record.id]);
            } else {
              setExpandedRowKeys(
                expandedRowKeys.filter((i) => i !== record.id)
              );
            }
          },
          expandIcon: ({ expanded, onExpand, record }) => {
            return record?.has_child ? (
              !expanded ? (
                <PlusOutlined
                  style={{ marginRight: "10px", height: "10px", width: "10px" }}
                  rev={undefined}
                  onClick={(e) => {
                    onExpand(record, e);
                  }}
                />
              ) : (
                <MinusOutlined
                  style={{ marginRight: "10px", height: "10px", width: "10px" }}
                  rev={undefined}
                  onClick={(e) => {
                    onExpand(record, e);
                  }}
                />
              )
            ) : null;
          },
        }}
      />
    </div>
  );
}
