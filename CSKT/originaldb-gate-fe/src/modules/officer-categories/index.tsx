import { RouteObject } from 'react-router';
import loadable from '../../components/Loadable';
import { RouterUrl } from '@app/enums/router.enum';
import { CategoriesProvider } from "@app/contexts/CategoriesContext";
import { IEndPoint } from "@app/interfaces/common.interface";

const OfficerCategories = loadable(() => import('./layouts/OfficerCategories'));
const PositionCategories = loadable(() => import('./pages/PositionCategories'));
const RankCategories = loadable(() => import('./pages/RankCategories'));
const QualificationCategories = loadable(() => import('./pages/QualificationCategories'));
const CanBoCategories=loadable(()=> import('./pages/CanBoCategories'))

export enum OfficerCategoriesRoute {
  PositionCategories = `${RouterUrl.OfficerCategories}/chuc-vu`,
  RankCategories = `${RouterUrl.OfficerCategories}/cap-bac`,
  QualificationCategories = `${RouterUrl.OfficerCategories}/trinh-do-hoc-van`,
  DSCanbo = `${RouterUrl.OfficerCategories}/can-bo`,

}

export const endPoints: IEndPoint[] = [
  {
    key: OfficerCategoriesRoute.PositionCategories,
    value: 'position_categories',
    label: "DM chức vụ",
  },
  {
    key: OfficerCategoriesRoute.RankCategories,
    value: 'rank_categories',
    label: "DM cấp bậc",
  },
  {
    key: OfficerCategoriesRoute.QualificationCategories,
    value: 'qualification_categories',
    label: "DM trình độ học vấn",
  },
  {
    key: OfficerCategoriesRoute.DSCanbo,
    value: 'can_bo',
    label: "DS cán bộ",
  }
]

export const Router: RouteObject = {
  path: RouterUrl.OfficerCategories,
  element: <CategoriesProvider value={{ endPoints: endPoints }}>
    <OfficerCategories />
  </CategoriesProvider>,
  children: [
    {
      path: OfficerCategoriesRoute.PositionCategories,
      element: <PositionCategories />,
    },
    {
      path: OfficerCategoriesRoute.RankCategories,
      element: <RankCategories />,
    },
    {
      path: OfficerCategoriesRoute.QualificationCategories,
      element: <QualificationCategories />,
    },
    {
      path: OfficerCategoriesRoute.DSCanbo,
      element: <CanBoCategories />,
    },
  ]
}

