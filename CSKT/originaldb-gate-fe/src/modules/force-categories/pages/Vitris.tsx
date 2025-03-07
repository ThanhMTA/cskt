import {
    MinusOutlined,
    PlusCircleOutlined,
    PlusOutlined,
  } from "@ant-design/icons";
  import BaseTable from "@app/components/BaseTable";
  import { getFullAddressString, listToTree, makeid } from "@app/core/helper";
  import { TableProps } from "antd";
  import { useEffect, useMemo, useState } from "react";
  import { useModal } from "@app/contexts/ModalContext";
  import { Action } from "@app/enums";
  import { ITableAction } from "@app/interfaces/table.interface";
  import { IMeta } from "@app/interfaces/common.interface";
  import { VitriData} from "../types/vitris.types";
  import {
   getVitriList,
    metaVitri,
  } from "../store/Vitris.action";
  import ViTrisAction from "../components/VitrisAction";
  import { ORGANIZATIONS_FIELD_NAME } from "../constants/Organizations.constant";
  import { TableGeneralKeys } from "@app/enums/table.enum";
  import { Ward } from "@app/modules/it-categories/types/Ward.type";
  import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
  
  export const ACTION_TABLE: ITableAction[] = [
    {
      key: Action.Create,
      icon: <PlusCircleOutlined />,
      className: "border-none text-primary shadow-#0",
      title: "Thêm mới",
    },
  ];
  
  export default function Organizations() {
    // variables
    const { openModal } = useModal();
    const [dataSource, setDataSource] = useState<Partial<VitriData[]>>(
      []
    );
    const [meta, setMeta] = useState<IMeta>({ count: 0 });
    const [pagination, setPagination] = useState<{
      page: number;
      pageSize: number;
    }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
    const [filter, setFilter] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const COLUMNS: TableProps["columns"] = useMemo(
      () =>
        [
           {
                     title: "Vị trí",
                     dataIndex: "name",
                     fixed: 'left',
                     key: TableGeneralKeys.Name,
                     render: (value: any, record: VitriData) => {
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
                     title: "Tên viết tắt",
                     dataIndex: "short_name",
                     key: "short_name",
                 },
                 {
                     title: "Vị trí cấp trên",
                     dataIndex: "parent_id",
                     key: "parent_id",
         
                 },
          
                 {
                     title: "Địa chỉ ",
                     dataIndex: "ward_id",
                     key: "ward_id",
                     width: 300,
                     render: (value: Ward) => getFullAddressString(value),
                     // render: (_, item) => item?.diachi_id?.name
                     // render: (_, item) => {
                     //     const diachi = item?.diachi_id?.name;
                     //     const huyen = item?.diachi_id?.district_id?.name;
                     //     const tinh = item?.diachi_id?.district_id?. province_id?.name;
                     //     return `${diachi || ""} ${huyen ? `- ${huyen}` : ""} ${tinh ? `- ${tinh}` : ""}`.trim();
                     // }
         
                 },
                 {
                     title: "Trạng thái",
                     dataIndex: "is_enable",
                     key: "is_enable",
                     render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>
                 },
        ]?.map((i) => {
          return {
            ...i,
            key: i?.key || makeid(),
          };
        }),
      []
    );
  
    // functions
    const fetchData = async (filter: any) => {
      try {
        setIsLoading(true);
        let initFilter = {};
        if (JSON.stringify(filter) === "{}") {
          initFilter = { parent_id: { _null: true } };
        }
        const response: any = await Promise.all([
          await getVitriList({ limit: -1 }, { ...filter, ...initFilter }),
          await metaVitri(filter),
        ]);
        setDataSource(response[0]);


        setMeta(response[1]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
  
    const fetchChildData = async (parentId: string) => {
      // Check if there are already items with the same parentId
      const hasChildData = dataSource.some(
        (item: any) => item.parent_id === parentId
      );
  
      if (hasChildData) {
        return; // Do not call API if child data already exists
      }
  
      try {
        setIsLoading(true);
        const response = await getVitriList(
          { limit: -1 },
          { parent_id: parentId }
        );
        setDataSource([...dataSource, ...response]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
  
    const handleViewDetail = (item: VitriData) => {
      openModal(<ViTrisAction detail={item} action={Action.View} />, {
        width: "50vw",
        onModalClose(res) {
          if (res?.success) {
            openModal(
              <ViTrisAction detail={item} action={Action.Update} />,
              {
                width: "50vw",
                onModalClose() {
                  reloadPage();
                },
              }
            );
          } else {
            reloadPage();
          }
        },
      });
    };
  
    const handleActions = (key: Action, item: VitriData) => {
      switch (key) {
        case Action.View:
          handleViewDetail(item);
          break;
        case Action.Create:
          openModal(
            <ViTrisAction parent_id={item?.id} action={Action.Create} />,
            {
              width: "50vw",
              onModalClose(res) {
                if (res?.success) {
                  reloadPage();
                }
              },
            }
          );
      }
    };
  
    const reloadPage = () => {
      fetchData(filter);
    };
  
    useEffect(() => {
      fetchData(filter);
    }, [filter]);
    //return
    return (
      <div className="w-[900px]">
        <BaseTable
          hiddenIndex={true}
          total={meta?.count || 0}
          className="mt-5"
          isReloadButton={false}
          setFilter={setFilter}
          setPagination={setPagination}
          dataSource={listToTree(dataSource)}
          columns={COLUMNS}
          actionList={ACTION_TABLE}
          isAction={true}
          actionWidth={100}
          rowClassName="hover:bg-secondary group"
          loading={isLoading}
          pagination={false}
          x={1400}
          actionClick={handleActions}
          filterColumns={[TableGeneralKeys.Name]}
          btnCreate={true}
          handleCreate={() => {
            openModal(<ViTrisAction action={Action.Create} />, {
              width: "50vw",
              onModalClose(res) {
                if (res?.success) {
                  reloadPage();
                }
              },
            });
          }}
          expandable={{
            onExpand: (expanded, record) => {
              if (expanded) {
                fetchChildData(record.id);
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
          rowKey={"id"}
        />
      </div>
      
    );
  }
  