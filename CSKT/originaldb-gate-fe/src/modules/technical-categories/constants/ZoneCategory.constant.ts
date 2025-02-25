import { SelectProps } from "antd";
import { ZoneCode } from "../enums/Zone.enum";

export const ZONE_CATEGORY = {
  NAME: "Tên",
  CODE: "Tên viết tắt",
  DESCRIPTION: "Ghi chú",
  IS_ENABLE: "Trạng thái",
};

export const ZONE_SCOPE_OPTIONS: SelectProps["options"] = [
  {
    label: ZoneCode.BGĐL,
    value: ZoneCode.BGĐL,
  },
  {
    label: ZoneCode.DK1,
    value: ZoneCode.DK1,
  },
  {
    label: ZoneCode.TSa,
    value: ZoneCode.TSa,
  },
  {
    label: ZoneCode.ĐBG,
    value: ZoneCode.ĐBG,
  },
  {
    label: ZoneCode.ĐL,
    value: ZoneCode.ĐL,
  },
];
