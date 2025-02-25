import { TableProps } from "antd";
import { TableDefaultValue } from "@app/enums/table.enum";

export const TABLE_PAGINATION_DEFAULT:TableProps["pagination"] = {
  defaultCurrent: TableDefaultValue.Page,
  defaultPageSize: TableDefaultValue.PageSize,
  size: "default",
  showSizeChanger: true,
 }

 export const TABLE_FIELD_NAME = {
  ORDER_NUMBER: "Số thứ tự"
 }