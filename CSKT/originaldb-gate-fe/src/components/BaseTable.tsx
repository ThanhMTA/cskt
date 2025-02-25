import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { TABLE_PAGINATION_DEFAULT } from "@app/constants/table.constant";
import { Action, PermissionAction, TableDataIndex, TableKey } from "@app/enums";
import { TableDefaultValue } from "@app/enums/table.enum";
import { ITable, ITableAction } from "@app/interfaces/table.interface";
import {
  Button,
  Flex,
  Input,
  InputRef,
  Space,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import { ColumnsType } from "antd/lib/table";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import HasPermission from "./HasPermission";
import button from "@app/assets/svg/button.svg";
import { Popconfirm } from "antd/lib";
import { BUTTON_LABEL, MESSAGE_CONTENT } from "@app/constants/common.constant";
import { TBVTCategoriesType } from "@app/modules/force-categories/enums/TBVTCategories.enum";

// --> Cập nhật arguments thì cập nhật trong cả table interface
const BaseTable: React.FC<ITable> = memo(
  ({
    //properties
    hiddenIndex = false,
    isAction,
    actionList,
    isReloadButton,
    titleTable,
    columns,
    total,
    meta,
    actionHeader,
    actionWidth,
    paginationCustom,
    filterColumns,
    btnCreate,
    x,
    y,
    setFilter,
    setPagination,
    actionClick,
    reloadClick,
    actionHeaderClick,
    handleCreate,
    ...props
  }) => {
    //STT
    const columnsDefault: TableProps["columns"] = [
      {
        title: "STT",
        dataIndex: TableDataIndex.OrdinalNumber,
        key: TableKey.Stt,
        width: 70,
        fixed: "left",
        align: "center",
        hidden: hiddenIndex,
      },
    ];

    //VARIABLE
    const [columnsMap, setColumnsMap] = useState<TableProps["columns"]>([]);
    const [dataSourceMap, setDataSourceMap] = useState<any>([]);
    const searchInput = useRef<InputRef>(null);
    const paginationBaseTable = useRef({
      page: TableDefaultValue.Page,
      pageSize: TableDefaultValue.PageSize,
    });
    // const [searchText, setSearchText] = useState("");
    // const [searchedColumn, setSearchedColumn] = useState("");
    //FUNCTIONS
    const handleTotal = (
      total: number,
      range: [number, number]
    ): JSX.Element => <p>{`Tổng số: ${total}`}</p>;
    const columnAction = useCallback(() => {
      return actionList
        ? [
            {
              title: "",
              key: TableKey.Action,
              width: actionWidth || 80,
              fixed: "right",
              render: (_: any, item: any) => {
                if (
                  (item?.code &&
                    item?.tree_level &&
                    item?.tree_path &&
                    //Vat tu
                    item?.type &&
                    ["VT", "HC", "CT"].includes(item?.type) &&
                    item?.code?.split(".").splice(-1)?.[0] ===
                      "0".repeat(
                        item?.code?.split(".").splice(-1)?.[0].length
                      )) ||
                  //don vi
                  (item?.code?.split(".").splice(-1)?.[0] ===
                    "0".repeat(item?.code?.split(".").splice(-1)?.[0].length) &&
                    item?.code &&
                    item?.tree_level &&
                    item?.tree_path)
                ) {
                  return (
                    <div className="group min-w-full flex items-center">
                      <Space
                        size="middle"
                        className="flex-row hidden group-hover:flex"
                      >
                        {actionList?.map((action: ITableAction) => (
                          <Tooltip
                            key={action?.key}
                            title={action?.tooltip}
                            mouseEnterDelay={0.3}
                          >
                            {action?.key === Action.Delete ? (
                              <Popconfirm
                                title={MESSAGE_CONTENT.DELETE}
                                onConfirm={() =>
                                  (actionClick as any)(action?.key, item)
                                }
                                okText={BUTTON_LABEL.CORRECT}
                                cancelText={BUTTON_LABEL.NO}
                              >
                                <Button
                                  htmlType="button"
                                  size="small"
                                  className={`${
                                    action?.title ? "px-1" : ""
                                  } button-icon ${action.className} h-[23px]`}
                                  type={action?.type}
                                >
                                  {action?.icon}
                                  {action?.title}
                                </Button>
                              </Popconfirm>
                            ) : (
                              <Button
                                size="small"
                                onClick={() =>
                                  (actionClick as any)(action?.key, item)
                                }
                                className={`${
                                  action?.title ? "px-1" : ""
                                } button-icon ${action.className} h-[23px]`}
                                type={action?.type}
                              >
                                {action?.icon}
                                {action?.title}
                              </Button>
                            )}
                          </Tooltip>
                        ))}
                      </Space>
                    </div>
                  );
                }
                return null;
              },
            },
          ]
        : [];
    }, [actionList, props.dataSource]);

    const onChangePagination = (page: number, pageSize: number) => {
      paginationBaseTable.current = { page, pageSize };
      // mapOrdinalNumber(
      //   page,
      //   pageSize
      // )
    };

    const mapOrdinalNumber = useCallback(
      (page: number, pageSize: number) => {
        const dataMap = props?.dataSource?.map((item, index) => ({
          ...item,
          ordinalNumber:
            ((page as number) - 1) * (pageSize as number) + (index + 1),
        }));
        setDataSourceMap(dataMap);
      },
      [props?.dataSource]
    );

    const resetPagination = () => {
      paginationBaseTable.current = {
        page: 1,
        pageSize: paginationBaseTable.current?.pageSize,
      };
      setPagination({
        page: 1,
        pageSize: paginationBaseTable.current?.pageSize,
      });
    };
    const handleSearch = (
      selectedKeys: string[],
      confirm: FilterDropdownProps["confirm"],
      dataIndex: string
    ) => {
      if (setFilter) {
        resetPagination();
        if (selectedKeys.length > 0) {
          setFilter({
            [dataIndex]: {
              _icontains: selectedKeys[0].toLowerCase(),
            },
          });
        } else {
          setFilter({});
        }
      }
      // confirm();
      // setSearchText(selectedKeys[0]);
      // setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
      clearFilters();
      setFilter && setFilter({});
      resetPagination();
    };

    const getColumnSearchProps = useCallback(
      (dataIndex: any) => ({
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          close,
        }: any) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={searchInput}
              className="mb-2 block"
              placeholder="Tìm kiếm"
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys as string[], confirm, dataIndex);
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() =>
                  handleSearch(selectedKeys as string[], confirm, dataIndex)
                }
                icon={<SearchOutlined />}
              >
                Tìm kiếm
              </Button>
              <Button onClick={() => clearFilters && handleReset(clearFilters)}>
                Xóa tìm kiếm
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                Đóng
              </Button>
            </Space>
          </div>
        ),
        filterIcon: () => <SearchOutlined />,
        onFilter: (value: string, record: any) =>
          (record[dataIndex] as any)
            ?.toString()
            ?.toLowerCase()
            ?.includes((value as string)?.toLowerCase()),
        onFilterDropdownOpenChange: (visible: boolean) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
      }),
      []
    );

    useEffect(() => {
      let newColumns = [
        ...columnsDefault,
        ...(columns as ColumnsType[]),
        ...(isAction ? columnAction() : []),
      ] as TableProps["columns"];
      if (newColumns && filterColumns && filterColumns?.length > 0) {
        newColumns = newColumns.map((col) => {
          if (col?.key && filterColumns.indexOf(col?.key as string) > -1) {
            return {
              ...col,
              ...getColumnSearchProps(col?.key),
            };
          }
          return col;
        }) as TableProps["columns"];
      }
      setColumnsMap(newColumns);
    }, [columns, filterColumns, getColumnSearchProps]);

    useEffect(() => {
      mapOrdinalNumber(
        paginationBaseTable.current?.page,
        paginationBaseTable.current?.pageSize
      );
    }, [props?.dataSource]);

    //RETURN
    return (
      <div>
        <Table
          //properties
          bordered={false}
          rootClassName="base-table"
          title={() => {
            return titleTable ? (
              <Flex justify="space-between" gap={20} className="p-3">
                <div className="font-bold text-base ">
                  {titleTable}
                  <span className="ml-1 font-bold">
                    ({total || meta?.itemCount})
                  </span>
                </div>
                <Flex gap={12}>
                  {actionHeader?.length &&
                    actionHeader?.map((item) => {
                      return (
                        <Tooltip key={item?.key} title={item?.tooltip}>
                          <Button
                            className={`flex items-center ${item?.className}`}
                            type={item?.type || "default"}
                            onClick={() =>
                              (actionHeaderClick as any)(item?.key as Action)
                            }
                          >
                            {/* <img src={item?.icon} className="h-full" alt="" /> */}
                            {item?.icon}
                            <span>{item.title}</span>
                          </Button>
                        </Tooltip>
                      );
                    })}
                  {isReloadButton && (
                    <Tooltip title="Làm mới">
                      <Button className="button-icon" onClick={reloadClick}>
                        <ReloadOutlined className=" text-gray-700 animate-spin" />
                      </Button>
                    </Tooltip>
                  )}
                </Flex>
              </Flex>
            ) : (
              <></>
            );
          }}
          columns={columnsMap}
          pagination={{
            ...TABLE_PAGINATION_DEFAULT,
            total,
            ...paginationCustom,
            pageSizeOptions: ["10", "50", "100", "1000", "10000"],
            onChange: onChangePagination,
            showTotal: handleTotal,
          }}
          scroll={{ y: y ?? 402, x: x ?? 200 }}
          rowKey={"id"} //là unique key của 1 row, nó same key của react render list
          size="middle"
          //methods
          {...props}
          dataSource={dataSourceMap}
        />
        {btnCreate && (
          <HasPermission action={PermissionAction.create}>
            <div
              className={`absolute z-10 right-0`}
              style={{ bottom: "4vh", marginRight: 15 }}
            >
              <Button
                className="flex rounded-[30px] w-[50px] h-[50px] justify-center items-center"
                type="primary"
                onClick={handleCreate}
              >
                <img src={button} alt="Button" width={50} />
              </Button>
            </div>
          </HasPermission>
        )}
      </div>
    );
  }
);

export default BaseTable;
