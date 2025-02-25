import { icCanBoHome, icChinhTriHome, icCNTTHome, icHauCanHome, icKyThuatHome, icQuanLucHome, icTacChienHome, icVanThuHome } from "@app/configs/assets.config";
import { RouterUrl } from "@app/enums/router.enum";


export const CATEGORIES_DATABASE = [
  {
    icon: icCanBoHome,
    label: "Dữ liệu dùng chung Cán bộ",
    categoryCount: 1,
    route: RouterUrl.OfficerCategories
  },
  {
    icon: icCNTTHome,
    label: "Dữ liệu dùng chung CNTT",
    categoryCount: 2,
    route: RouterUrl.ITCategories
  },
  {
    icon: icQuanLucHome,
    label: "Dữ liệu dùng chung Quân lực",
    categoryCount: 3,
    route: RouterUrl.ForceCategories
  },
  {
    icon: icKyThuatHome,
    label: "Dữ liệu dùng chung Kỹ thuật",
    categoryCount: 4,
    route: RouterUrl.TechnicalCategories
  },
  {
    icon: icChinhTriHome,
    label: "Dữ liệu dùng chung Chính trị",
    categoryCount: 0,
  },
  {
    icon: icHauCanHome,
    label: "Dữ liệu dùng chung Hậu cần",
    categoryCount: 5,
    route: RouterUrl.LogisticsCategories
  },
  {
    icon: icTacChienHome,
    label: "Dữ liệu dùng chung Tác chiến",
    categoryCount: 5,
    route: RouterUrl.OperationCategories
  },
  {
    icon: icVanThuHome,
    label: "Dữ liệu dùng chung Văn thư bảo mật",
    categoryCount: 5,
    route: RouterUrl.SecurityPapers
  },
]