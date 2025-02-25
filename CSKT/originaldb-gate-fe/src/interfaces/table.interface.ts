import { Action } from "@app/enums";
import { ButtonProps, TableProps } from "antd";
import { IResponseMeta } from "./response.interface";

export interface ITableAction {
  icon?: any;
  key?: Action;
  tooltip?: string;
  title?: string;
  className?: string;
  type?: ButtonProps["type"];
}

export interface ITableMethods {
  actionClick?: (
    // khi click button của từng bản ghi
    key: Action,
    item: any
  ) => void;

  setFilter?: any;
  setPagination?: any;
  reloadClick?: () => void; // click button reload data,
  actionHeaderClick?: (
    // khi click button trên header table
    key: Action
  ) => void;
  onChangeBaseTable?: (event: TableProps["pagination"] | any) => void;
  handleCreate?: () => void;
}

export interface ITable extends TableProps, ITableMethods {
  total?: number;
  titleTable?: string;
  isReloadButton?: boolean;
  isAction?: boolean;
  hiddenIndex?: boolean;
  actionList?: ITableAction[];
  meta?: IResponseMeta;
  actionHeader?: ITableAction[];
  actionWidth?: number; // chiều dài của cột action
  paginationCustom?: TableProps["pagination"];
  filterColumns?: string[];
  btnCreate?: boolean;
  x?: number;
  y?: number;
  isFullWidth?: boolean;
}

export interface ITablePagination {
  current: number;
  pageSize: number;
}
