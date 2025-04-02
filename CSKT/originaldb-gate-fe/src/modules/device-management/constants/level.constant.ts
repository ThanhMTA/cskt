import { SelectProps } from "antd";
import { LevelCategoriesScope } from "../enum/LevelCategory.enum";
import { OFFICAL } from "@app/modules/technical-categories/enums/TechnicalTeams.enum";

export const LEVEL_SCOPE_OPTIONS: SelectProps["options"] = [
  {
    label: "Chiến dịch",
    value: LevelCategoriesScope.CHIEN_DICH,
  },
  {
    label: "Chiến lược",
    value: LevelCategoriesScope.CHIEN_LUOC,
  },
  {
    label: "Chiến thuật",
    value: LevelCategoriesScope.CHIEN_THUAT,
  },
];
export const QUALITY_SCOPE_OPTIONS: SelectProps["options"] = [
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  {
    label: "4",
    value: 4,
  },
  {
    label: "5",
    value: 5,
  },
];

export const OFFICAL_OPTIONS: SelectProps["options"] = [
  {
    label: "Chính thức",
    value: OFFICAL.CHINH_THUC,
  },
  {
    label: "Kiêm nhiệm",
    value: OFFICAL.KIEM_NHIEM,
  },
];

export enum ActorRole {
  CSKT_K1 = "CSKT_K1",
  CSKT_DV = "CSKT_DV",
}
