import { SelectProps } from "antd";
import { PersonalIdentifyType } from "../enums/PersonalIdentify.enum";

export const PERSONAL_IDENTIFY_TYPE_LABEL = {
  SQ: "Sĩ quan",
  QNCN: "QNCN",
  CNVCQP: "CNVCQP",
  NVHĐ: "NVHĐ",
  HSQCS: "HSQCS",
}

export const PERSONAL_IDENTIFY_TYPE_OPTIONS:SelectProps["options"] = [
  {
    label: PersonalIdentifyType.SQ,
    value: PERSONAL_IDENTIFY_TYPE_LABEL.SQ
  },
  {
    label: PersonalIdentifyType.QNCN,
    value: PERSONAL_IDENTIFY_TYPE_LABEL.QNCN
  },
  {
    label: PersonalIdentifyType.CNVCQP,
    value: PERSONAL_IDENTIFY_TYPE_LABEL.CNVCQP
  },
  {
    label: PersonalIdentifyType.NVHĐ,
    value: PERSONAL_IDENTIFY_TYPE_LABEL.NVHĐ
  },
  {
    label: PersonalIdentifyType.HSQCS,
    value: PERSONAL_IDENTIFY_TYPE_LABEL.HSQCS
  }
]