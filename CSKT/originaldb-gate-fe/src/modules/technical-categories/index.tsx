import { RouteObject } from 'react-router';
import loadable from '../../components/Loadable';
import { RouterUrl } from '@app/enums/router.enum';
import { CategoriesProvider } from "@app/contexts/CategoriesContext";
import { IEndPoint } from "@app/interfaces/common.interface";


const TechnicalCategories = loadable(() => import('./pages/TechnicalCategories'));
const TechnicalCategory = loadable(() => import('./pages/TechnicalCategory'));
const FailureCauseCategories = loadable(() => import('./pages/FailureCauseCategories'));
const UnitCategories = loadable(() => import('../force-categories/pages/UnitCategories'));
const ReasonCategories = loadable(() => import('../force-categories/pages/ReasonCategories'));
const ConditionCategories = loadable(() => import('../force-categories/pages/ConditionCategories'));
const TBVTCategories = loadable(() => import('../force-categories/pages/TBVTCategories'));
const SpliceClosures = loadable(() => import('./pages/SpliceClosures'));
const IncidentTypeCategory = loadable(() => import('./pages/IncidentTypeCategories'));
const MajorCategory = loadable(() => import('./pages/MajorCategory'));
const ZoneCategories = loadable(() => import('./pages/ZoneCategories'));
const SpeciesCategories = loadable(() => import("./pages/SpeciesCategories"));



export enum TechnicalCategoriesRoute {
  UnitCategories = `${RouterUrl.TechnicalCategories}/don-vi-tinh`,
  // ReasonCategories = `${RouterUrl.TechnicalCategories}/ly-do-tang-giam-trang-thiet-bi`,
  ConditionCategories = `${RouterUrl.TechnicalCategories}/tinh-trang-trang-thiet-bi`,
  SpeciesCategories = `${RouterUrl.TechnicalCategories}/chung-loai-trang-thiet-bi`,
  NhomTBKT = `${RouterUrl.TechnicalCategories}/nhom-trang-thiet-bi`,
  HangSX = `${RouterUrl.TechnicalCategories}/hang-san-xuat`,
  NguonDauTu = `${RouterUrl.TechnicalCategories}/nguon-dau-tu`,
  ViTri= `${RouterUrl.TechnicalCategories}/vi-tri`,




  // TBVTCategories = `${RouterUrl.TechnicalCategories}/trang-bi-ky-thuat-nhom-I-II`,
  // FailureCauseCategories = `${RouterUrl.TechnicalCategories}/nguyen-nhan-hong-hoc`,
  // TechnicalTeams = `${RouterUrl.TechnicalCategories}/to-sua-chua-co-dong`,
  // TechnicalCategory = `${RouterUrl.TechnicalCategories}/xu-ly-su-co`,
  // IncidentCategory = `${RouterUrl.TechnicalCategories}/phan-loai-su-co`,
  // MajorCategories = `${RouterUrl.TechnicalCategories}/danh-muc-chuyen-nganh`,
  // ZoneCategories = `${RouterUrl.TechnicalCategories}/danh-muc-khu-vuc`,
  // SpliceClosures = `${RouterUrl.TechnicalCategories}/mang-xong`,

}

export const endPoints: IEndPoint[] = [
  // {
  //   key: TechnicalCategoriesRoute.ReasonCategories,
  //   value: 'reason_categories',
  //   label: "DM lý do tăng giảm",
  // },
  {
    key: TechnicalCategoriesRoute.UnitCategories,
    value: 'unit_categories',
    label: "DM đơn vị tính",
  },
  {
    key: TechnicalCategoriesRoute.ConditionCategories,
    value: 'condition_categories',
    label: "DM tình trạng",
  },
  {
    key: TechnicalCategoriesRoute.SpeciesCategories,
    value: "species_categories",
    label: "DM chủng loại TBKT",
  },
  {
    key: TechnicalCategoriesRoute.NhomTBKT,
    value: "Nhom_TBKT",
    label: "DM nhóm TBKT",
  },
  {
    key: TechnicalCategoriesRoute.HangSX,
    value: "hang_san_xuat",
    label: "DS hãng sản xuất",
  },
  {
    key: TechnicalCategoriesRoute.NguonDauTu,
    value: "nguon_dau_tu",
    label: "DS nguồn đầu tư",
  },
  {
    key: TechnicalCategoriesRoute.ViTri,
    value: "vi_tri",
    label: "DS vị trí",
  },
  // {
  //   key: TechnicalCategoriesRoute.TBVTCategories,
  //   value: 'tbvt_categories',
  //   label: "Danh mục TBKT nhóm 2, VTKT",
  // },
  // {
  //   key: TechnicalCategoriesRoute.SpliceClosures,
  //   value: 'splice_closures',
  //   label: "Danh sách măng xông",
  // },
  // {
  //   key: TechnicalCategoriesRoute.FailureCauseCategories,
  //   value: 'failure_cause_categories',
  //   label: "DM nguyên nhân hỏng hóc",
  // },
  // {
  //   key: TechnicalCategoriesRoute.TechnicalCategory,
  //   value: 'technical_category',
  //   label: "DM đơn vị XLSC",
  // },
  // {
  //   key: TechnicalCategoriesRoute.IncidentCategory,
  //   value: 'incident_type',
  //   label: "DM phân loại sự cố",
  // },
  // {
  //   key: TechnicalCategoriesRoute.MajorCategories,
  //   value: 'major_categories',
  //   label: "DM chuyên ngành",
  // },
  // {
  //   key: TechnicalCategoriesRoute.ZoneCategories,
  //   value: 'zone_categories',
  //   label: "DM khu vực",
  // },

]

export const Router: RouteObject = {
  path: RouterUrl.TechnicalCategories,
  element: <CategoriesProvider value={{ endPoints: endPoints }}>
    <TechnicalCategories />
  </CategoriesProvider>,
  children: [
    {
      path: TechnicalCategoriesRoute.UnitCategories,
      element: <UnitCategories />
    },
    // {
    //   path: TechnicalCategoriesRoute.ReasonCategories,
    //   element: <ReasonCategories />
    // },
    {
      path: TechnicalCategoriesRoute.ConditionCategories,
      element: <ConditionCategories />
    },
    {
      path: TechnicalCategoriesRoute.SpeciesCategories,
      element: <SpeciesCategories />,
    },
    {
      path: TechnicalCategoriesRoute.NhomTBKT,
      element: <SpeciesCategories />,// sửa mục nhóm kỹ thuật 
    },
    {
      path: TechnicalCategoriesRoute.HangSX,
      element: <ConditionCategories  />,// sửa mục hãng sản xuất
    },
    {
      path: TechnicalCategoriesRoute.NguonDauTu,
      element: <ConditionCategories  />,// sửa mục hãng sản xuất
    },
    {
      path: TechnicalCategoriesRoute.ViTri,
      element: <ConditionCategories  />,// sửa mục hãng sản xuất
    },

    // {
    //   path: TechnicalCategoriesRoute.TBVTCategories,
    //   element: <TBVTCategories />
    // },
    // {
    //   path: TechnicalCategoriesRoute.FailureCauseCategories,
    //   element: <FailureCauseCategories />
    // },
    // {
    //   path: TechnicalCategoriesRoute.TechnicalCategory,
    //   element: <TechnicalCategory />
    // },
    // {
    //   path: TechnicalCategoriesRoute.IncidentCategory,
    //   element: <IncidentTypeCategory />
    // },
    // {
    //   path: TechnicalCategoriesRoute.MajorCategories,
    //   element: <MajorCategory />
    // },
    // {
    //   path: TechnicalCategoriesRoute.ZoneCategories,
    //   element: <ZoneCategories />
    // },
    // {
    //   path: TechnicalCategoriesRoute.SpliceClosures,
    //   element: <SpliceClosures />
    // }
  ]
}

