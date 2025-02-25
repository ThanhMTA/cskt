import { RouteObject } from 'react-router';
import loadable from '../../components/Loadable';
import { RouterUrl } from '@app/enums/router.enum';
import TechnicalDetailByOrganization from './pages/TechnicalDetailByOrganization';

const TechnicalOrganization = loadable(() => import('./pages/TechnicalOrganization'));
const DetailTechnicalOrganization = loadable(() => import('./pages/DetailTechnicalOrganization'));

export enum TechnicalManagementRoute {
    TechnicalAssuranceDetail = `${RouterUrl.TechnicalAssurance}/:id`,
    TechnicalDetailByOrg = `${RouterUrl.TechnicalAssurance}/tong-hop-vtkt-dcsc/:id`,
}

export const Router: RouteObject = {
    path: '',
    children: [
        {
            path: RouterUrl.TechnicalAssurance,
            element: <TechnicalOrganization />,
        },
        {
            path: TechnicalManagementRoute.TechnicalAssuranceDetail,
            element: <DetailTechnicalOrganization />,
        },
        {
            path: TechnicalManagementRoute.TechnicalDetailByOrg,
            element: <TechnicalDetailByOrganization />,
        },
    ]
}