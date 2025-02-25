import { SelectProps } from "antd";
import { ReasonCategoriesTypeFor } from "../enums/ReasonCategories.enum";

export const REASON_TYPE_TEXT = {
  TB: "Trang bị",
  VT: "Vật tư"
}

export const REASON_FIELD_NAME = {
  NAME: "Nội dung lý do tăng giảm",
  CODE: "Mã lý do tăng giảm",
  TYPE_FOR: "Loại",
  IS_ENABLE: "Trạng thái" 
}

export const REASON_TYPE_FOR_OPTIONS:SelectProps["options"] = [
  {
    label: REASON_TYPE_TEXT.TB,
    value: ReasonCategoriesTypeFor.TB
  },
  {
    label: REASON_TYPE_TEXT.VT,
    value: ReasonCategoriesTypeFor.VT
  }
]