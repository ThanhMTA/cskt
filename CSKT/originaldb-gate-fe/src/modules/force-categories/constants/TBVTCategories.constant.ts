import { SelectProps } from "antd";
import { TBVTCategoriesType } from "../enums/TBVTCategories.enum";

export const TBVT_CATEGORIES_TYPE_OPTIONS:SelectProps["options"] = [
  {
    label: TBVTCategoriesType.TB,
    value: TBVTCategoriesType.TB
  },
  {
    label: TBVTCategoriesType.CT,
    value: TBVTCategoriesType.CT
  },
  {
    label: TBVTCategoriesType.VT,
    value: TBVTCategoriesType.VT
  },
  {
    label: TBVTCategoriesType.HC,
    value: TBVTCategoriesType.HC
  }
]

export const TBVT_CATEGORIES_FIELD_NAME = {
  NAME: "Tên trang bị",
  DESC: "Mô tả",
  IS_ENABLE: "Trạng thái",
  CODE: "Mã trang bị, vật tư",
  ORIGIN_ID: "Định danh nước sản xuất",
  LENGTH: "Chiều dài trang bị",
  WIDTH: "Chiều rộng trang bị",
  HEIGHT: "Chiều cao trang bị",
  WEIGHT: "Khối lượng trang bị",
  UNIT: "Đơn vị tính",
  IS_PLANNING: "TB có nằm trong diện quy hoạch?",
  SPECIES_ID: "Chủng loại",
  PARENT_ID: "Thuộc nhóm TB",
  HAS_CHILD: "TB có chứa TB",
  MARJOR_CATEGORIES: "Thuộc chuyên ngành",
  AMOUNT: "Số lượng",
  SERIAL_NUMBER: "Serial number",
  TYPE: "Loại",
  ID_EX: "Mã định danh mở rộng do Bộ quốc phòng quy định ",
  CODE_EX: "Mã trang bị mở rộng do Bộ quốc phòng quy định",
  TREE_LEVEL: "Cấp mã trang bị khi dựng tree",
  TREE_PATH: "Đường dẫn của Tree"
}