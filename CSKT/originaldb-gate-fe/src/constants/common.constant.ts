import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import { Action } from "@app/enums";
import { ITablePagination } from "@app/interfaces/table.interface";

export const TITLE_MODAL_TYPE: { key: Action; title: string }[] = [
  {
    key: Action.Create,
    title: "Thêm mới",
  },
  {
    key: Action.Update,
    title: "Chỉnh sửa",
  },
  {
    key: Action.Update,
    title: "Chỉnh sửa",
  },
  {
    key: Action.View,
    title: "Chi tiết",
  },
];

export const BUTTON_LABEL = {
  NO: "Hủy",
  YES: "Có",
  CORRECT: "Đồng ý",
};

export const MESSAGE_CONTENT = {
  DELETE: "Đ/c có chắc chắn muốn xóa dữ liệu không?",
};

export const PAGINATION_TABLE_DEFAULT: ITablePagination = {
  current: 1,
  pageSize: DEFAULT_PAGESIZE,
};

export const Actor = {
  CKT: "CKT",
  CQL: "CQL",
  CCT: "CCT"
};
