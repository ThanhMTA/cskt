import { MenuKey, RouterUrl } from "@app/enums/router.enum";
import {
  icCNTTHome,
  icCanBoHome,
  icChinhTriHome,
  icHauCanHome,
  icKyThuatHome,
  icQuanLucHome,
  icTacChienHome,
  icVanThuHome,
} from "./assets.config";
export const ActorDM = [
  "CCT",
  "CKT",
  "CHC",
  "P_CB",
  "P_TC",
  "P_QL",
  "TB4",
  "VT_BM",
  "test",
];
export const ActorCSKT = ["CSKT_K1", "CSKT_DV"];
export const NAVBAR_ITEMS: any[] = [
  {
    label: "Trang chủ",
    key: MenuKey.Home,
    route: "/",
    actor: ActorDM,
  },
  {
    label: "Quản lý danh mục",
    key: MenuKey.Categories,
    route: "/danh-muc",
    onClick: (event: React.MouseEvent) => {
      event.preventDefault(); // This will stop the NavLink from navigating
    },
    actor: ActorDM,
    children: [
      // {
      //   label: "Dữ liệu dùng chung - Chính trị",
      //   route: RouterUrl.PoliticsCategories,
      //   key: "CCT",
      //   icon: icChinhTriHome,
      // },
      {
        label: "Dữ liệu dùng chung - Kỹ thuật",
        route: RouterUrl.TechnicalCategories,
        key: "CKT",
        icon: icKyThuatHome,
      },
      // {
      //   label: "Dữ liệu dùng chung - Hậu cần",
      //   route: RouterUrl.LogisticsCategories,
      //   key: "CHC",
      //   icon: icHauCanHome,
      // },

      {
        label: "Dữ liệu dùng chung - Cán bộ",
        route: RouterUrl.OfficerCategories,
        key: "P_CB",
        icon: icCanBoHome,
      },
      // {
      //   label: "Dữ liệu dùng chung - Tác Chiến",
      //   route: RouterUrl.OperationCategories,
      //   key: "P_TC",
      //   icon: icTacChienHome,
      // },
      {
        label: "Dữ liệu dùng chung - Quân lực",
        route: RouterUrl.ForceCategories,
        key: "P_QL",
        icon: icQuanLucHome,
      },
      {
        label: "Dữ liệu dùng chung - CNTT",
        route: RouterUrl.ITCategories,
        key: "TB4",
        icon: icCNTTHome,
      },

      // {
      //   label: "Dữ liệu dùng chung - Văn thư ",
      //   route: RouterUrl.SecurityPapers,
      //   key: "VT_BM",
      //   icon: icVanThuHome,
      // },
      
      // {
      //   label: "Dữ liệu dùng chung - test thử",
      //   route: RouterUrl.Test,
      //   key: "test",
      //   icon: icVanThuHome,
      // },
      
    ],
  },
  {
    label: "Quản lý CSKT",
    key: MenuKey.TechnicalOrganization,
    route: "/quan-ly-cskt",
    actor: ActorCSKT,
    // actor:ActorDM
  },
  {
    label: "Quản trị hệ thống",
    key: MenuKey.SystemManagement,
    route: "/quan-tri-he-thong",
    actor: ActorCSKT,
  },
  {
    label: "test",
    key: MenuKey.TestMenu,
    route: "/test-menu",
    actor: ActorCSKT,
  },
];
