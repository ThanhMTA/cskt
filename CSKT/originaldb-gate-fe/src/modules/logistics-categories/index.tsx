import { RouteObject } from "react-router";
import loadable from "../../components/Loadable";
import { RouterUrl } from "@app/enums/router.enum";
import { IEndPoint } from "@app/interfaces/common.interface";
import { CategoriesProvider } from "@app/contexts/CategoriesContext";

const LogisticsCategories = loadable(
  () => import("./pages/LogisticsCategories")
);
const RealEstateTypeCategories = loadable(
  () => import("./pages/RealEstateTypeCategories")
);
const EquipmentTypeCategories = loadable(
  () => import("./pages/EquipmentTypeCategories")
);
const GrantDecisionCategories = loadable(
  () => import("./pages/GrantDecisionCategories")
);
const TBVTCategories = loadable(
  () => import("../force-categories/pages/TBVTCategories")
);

export enum LogisticsCategoriesRoute {
  RealEstateTypeCategories = `${RouterUrl.LogisticsCategories}/loai-nha`,
  EquipmentTypeCategories = `${RouterUrl.LogisticsCategories}/loai-vat-chat`,
  GrantDecisionCategories = `${RouterUrl.LogisticsCategories}/cap-quyet-dinh`,
  TBVTCategories = `${RouterUrl.LogisticsCategories}/trang-bi-ky-thuat-nhom-I-II`,
}
export const endPoints: IEndPoint[] = [
  {
    key: LogisticsCategoriesRoute.TBVTCategories,
    value: "tbvt_categories",
    label: "DM TBVT Hậu cần",
  },
  {
    key: LogisticsCategoriesRoute.RealEstateTypeCategories,
    value: "real_estate_type_categories",
    label: "DM loại nhà",
  },
  {
    key: LogisticsCategoriesRoute.EquipmentTypeCategories,
    value: "equipment_type_categories",
    label: "DM loại vật chất",
  },
  {
    key: LogisticsCategoriesRoute.GrantDecisionCategories,
    value: "grant_decision_categories",
    label: "DM cấp QĐ",
  },
];
export const Router: RouteObject = {
  path: RouterUrl.LogisticsCategories,
  element: (
    <CategoriesProvider value={{ endPoints: endPoints }}>
      <LogisticsCategories />
    </CategoriesProvider>
  ),
  children: [
    {
      path: LogisticsCategoriesRoute.RealEstateTypeCategories,
      element: <RealEstateTypeCategories />,
    },
    {
      path: LogisticsCategoriesRoute.EquipmentTypeCategories,
      element: <EquipmentTypeCategories />,
    },
    {
      path: LogisticsCategoriesRoute.GrantDecisionCategories,
      element: <GrantDecisionCategories />,
    },
    {
      path: LogisticsCategoriesRoute.TBVTCategories,
      element: <TBVTCategories />,
    },
  ],
};
