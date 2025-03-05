import { RouteObject } from "react-router";
import loadable from "../../components/Loadable";
import { RouterUrl } from "@app/enums/router.enum";
import { CategoriesProvider } from "@app/contexts/CategoriesContext";
import { IEndPoint } from "@app/interfaces/common.interface";

const ForceCategories = loadable(() => import("./pages/ForceCategories"));
const UnitCategories = loadable(() => import("./pages/UnitCategories"));
const ReasonCategories = loadable(() => import("./pages/ReasonCategories"));
const ConditionCategories = loadable(
  () => import("./pages/ConditionCategories")
);
const MajorCategory = loadable(
  () => import("../technical-categories/pages/MajorCategory")
);
const SpeciesCategories = loadable(() => import("./pages/SpeciesCategories"));
const OrgTypeCategories = loadable(() => import("./pages/OrgTypeCategories"));
const Organizations = loadable(() => import("./pages/Organizations"));
const TBVTCategories = loadable(() => import("./pages/TBVTCategories"));
// const PersonalIdentify = loadable(() => import('./pages/PersonalIdentify'));

export enum ForceCategoriesRoute {
  // UnitCategories = `${RouterUrl.ForceCategories}/don-vi-tinh`,
  // ReasonCategories = `${RouterUrl.ForceCategories}/ly-do-tang-giam-trang-thiet-bi`,
  // ConditionCategories = `${RouterUrl.ForceCategories}/tinh-trang-trang-thiet-bi`,
  // MajorCategories = `${RouterUrl.ForceCategories}/chuyen-nganh`,
  // SpeciesCategories = `${RouterUrl.ForceCategories}/chung-loai-trang-thiet-bi`,
  // OrgTypeCategories = `${RouterUrl.ForceCategories}/loai-thiet-bi`,
  Organizations = `${RouterUrl.ForceCategories}/don-vi`,
  // OrganizationsOrgTypeCategories = `${RouterUrl.ForceCategories}/gan-loai-don-vi`,
  // TBVTCategories = `${RouterUrl.ForceCategories}/trang-bi-ky-thuat-nhom-I-II`,
  // TBVTCategoriesMajorCategories = `${RouterUrl.ForceCategories}/gan-chuyen-nganh-ma-trang-bi`,
  // PersonalIdentify = `${RouterUrl.ForceCategories}/quan-nhan`,
}

export const endPoints: IEndPoint[] = [
  {
    key: ForceCategoriesRoute.Organizations,
    value: "organizations",
    label: "DM đơn vị",
  },
  // {
  //   key: ForceCategoriesRoute.TBVTCategories,
  //   value: "tbvt_categories",
  //   label: "DM TBKT nhóm 1",
  // },
  // {
  //   key: ForceCategoriesRoute.UnitCategories,
  //   value: "unit_categories",
  //   label: "DM đơn vị tính",
  // },
  // {
  //   key: ForceCategoriesRoute.ReasonCategories,
  //   value: "reason_categories",
  //   label: "DM lý do tăng giảm",
  // },
  // {
  //   key: ForceCategoriesRoute.ConditionCategories,
  //   value: "condition_categories",
  //   label: "DM tình trạng",
  // },
  // {
  //   key: ForceCategoriesRoute.OrgTypeCategories,
  //   value: "org_type_categories",
  //   label: "DM loại đơn vị",
  // },

  // {
  //   key: ForceCategoriesRoute.MajorCategories,
  //   value: "major_categories",
  //   label: "DM chuyên ngành",
  // },
  // {
  //   key: ForceCategoriesRoute.SpeciesCategories,
  //   value: "species_categories",
  //   label: "DM chủng loại TBKT",
  // },
];

export const Router: RouteObject = {
  path: RouterUrl.ForceCategories,
  element: (
    <CategoriesProvider value={{ endPoints: endPoints }}>
      <ForceCategories />
    </CategoriesProvider>
  ),
  children: [
    // {
    //   path: ForceCategoriesRoute.UnitCategories,
    //   element: <UnitCategories />,
    // },
    // {
    //   path: ForceCategoriesRoute.ReasonCategories,
    //   element: <ReasonCategories />,
    // },
    // {
    //   path: ForceCategoriesRoute.ConditionCategories,
    //   element: <ConditionCategories />,
    // },
    // {
    //   path: ForceCategoriesRoute.MajorCategories,
    //   element: <MajorCategory />,
    // },
    // {
    //   path: ForceCategoriesRoute.SpeciesCategories,
    //   element: <SpeciesCategories />,
    // },
    // {
    //   path: ForceCategoriesRoute.OrgTypeCategories,
    //   element: <OrgTypeCategories />,
    // },
    {
      path: ForceCategoriesRoute.Organizations,
      element: <Organizations />,
    },
    // {
    //   path: ForceCategoriesRoute.TBVTCategories,
    //   element: <TBVTCategories />,
    // },
    // {
    //   path: ForceCategoriesRoute.PersonalIdentify,
    //   element: <PersonalIdentify />
    // },
  ],
};
