import { SelectProps } from "antd";
import { SpeciesCategoriesScope } from "../enums/SpeciesCategories.enum";

export const SPECIES_SCOPE_OPTIONS:SelectProps["options"] = [
  {
    label: SpeciesCategoriesScope.XE_TT,
    value: SpeciesCategoriesScope.XE_TT
  },
  {
    label: SpeciesCategoriesScope.TAU_THUYEN,
    value: SpeciesCategoriesScope.TAU_THUYEN
  },
  {
    label: SpeciesCategoriesScope.VSAT,
    value: SpeciesCategoriesScope.VSAT
  }
];

export const SPECIES_FIELD_NAME = {
  NAME: "Tên chủng loại",
  DESC: "Mô tả",
  SHORT_NAME: "Tên tắt chủng loại",
  IS_ENABLE: "Trạng thái",
  CODE: "Mã chủng loại",
  SCOPE: "Phạm vi"
}