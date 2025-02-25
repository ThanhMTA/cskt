import { RouteObject } from 'react-router';
import loadable from '../../components/Loadable';
import { RouterUrl } from '@app/enums/router.enum';
import { CategoriesProvider } from "@app/contexts/CategoriesContext";
import { IEndPoint } from "@app/interfaces/common.interface";

const PoliticsCategories = loadable(() => import('./pages/PoliticsCategories'));

const TBVTCategories = loadable(() => import('../force-categories/pages/TBVTCategories')); // cùng sử dụng bảng TBVTCategories với Phân hệ Quân lực

export enum PoliticsCategoriesRoute {
  TBVTCategories = `${RouterUrl.PoliticsCategories}/trang-bi-ky-thuat-nhom-I-II`,
}

export const endPoints: IEndPoint[] = [
  {
    key: PoliticsCategoriesRoute.TBVTCategories,
    value: 'tbvt_categories',
    label: "Danh mục Trang bị nhóm 2 ngành chính trị, vật tư CTĐ, CTCT",
  },

]

export const Router: RouteObject = {
  path: RouterUrl.PoliticsCategories,
  // element: <PoliticsCategories />,
  element: <CategoriesProvider value={{ endPoints: endPoints }}>
    <PoliticsCategories />
  </CategoriesProvider>,
  children: [
    {
      path: PoliticsCategoriesRoute.TBVTCategories,
      element: <TBVTCategories/>
    },
  ]
}

