import { RouteObject } from 'react-router';
import loadable from '../../components/Loadable';
import { RouterUrl } from '@app/enums/router.enum';

const SystemManagementPage = loadable(() => import('./pages/SystemManagement'));

export const Router: RouteObject = {
    path: '',
    children: [
        {
            path: RouterUrl.TestMenu,
            element: <SystemManagementPage />,
        }
    ]
}