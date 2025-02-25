import { RouteObject } from 'react-router';
import loadable from '../../components/Loadable';
import { RouterUrl } from '@app/enums/router.enum';
import { IEndPoint } from '@app/interfaces/common.interface';
import { CategoriesProvider } from '@app/contexts/CategoriesContext';

const SecurityPapers = loadable(() => import('./pages/SecurityPapers'));
const UrgencyCategories = loadable(() => import('./pages/UrgencyCategories'));
const SecurityCategories = loadable(() => import('./pages/SecurityCategories'));
const DocumentTypeCategories = loadable(() => import('./pages/DocumentTypeCategories'));




export enum SecurityPapersRoute {
  UrgencyCategories = `${RouterUrl.SecurityPapers}/do-khan`,
  SecurityCategories = `${RouterUrl.SecurityPapers}/do-mat`,
  DocumentTypeCategories = `${RouterUrl.SecurityPapers}/loai-van-ban`,
}

export const endPoints: IEndPoint[] = [
  {
    key: SecurityPapersRoute.UrgencyCategories,
    value: 'urgency_categories',
    label: "DM độ khẩn",
  },
  {
    key: SecurityPapersRoute.SecurityCategories,
    value: 'security_categories',
    label: "DM độ mật",
  },
  {
    key: SecurityPapersRoute.DocumentTypeCategories,
    value: 'document_type_categories',
    label: "DM loại văn bản",
  },
]

export const Router: RouteObject = {
  path: RouterUrl.SecurityPapers,
  element: <CategoriesProvider value={{ endPoints: endPoints }}>
    <SecurityPapers />
  </CategoriesProvider>,
  children: [
    {
      path: SecurityPapersRoute.UrgencyCategories,
      element: <UrgencyCategories />
    },
    {
      path: SecurityPapersRoute.SecurityCategories,
      element: <SecurityCategories />
    },
    {
      path: SecurityPapersRoute.DocumentTypeCategories,
      element: <DocumentTypeCategories />
    },
  ]
}

