import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RootBoundary } from "../components/RootBoundary";
import MasterLayout from "../layouts/master-layout";
import * as Home from '../modules/home';
import * as ITCategories from '../modules/it-categories';
import * as Auth from '../modules/auth';
import * as OfficerCategories from '../modules/officer-categories';
import * as LogisticsCategories from '../modules/logistics-categories';
import * as ForceCategories from '../modules/force-categories';
import * as SecurityPapers from '../modules/security-papers';
import * as TechnicalCategories from '../modules/technical-categories';
import * as OperationCategories from '../modules/operation-categories';
import * as PoliticsCategories from '../modules/politics-categories';
import * as TechnicalOrganization from '../modules/techinical-organization';
import * as SystemManagement from '../modules/system-management';
import { Loading } from '../components/loading/Loading';
// Guards
import { PublicGuard } from '../guards/PublicGuard';
import { PrivateGuard } from '../guards/PrivateGuard';
import { AuthLayout } from '@app/layouts/auth-layout';


const modules = [
    Home,
    ITCategories,
    OfficerCategories,
    LogisticsCategories,
    ForceCategories,
    SecurityPapers,
    TechnicalCategories,
    OperationCategories,
    PoliticsCategories,
    TechnicalOrganization,
    SystemManagement
]

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <RootBoundary />,
        children: [
            {
                path: '/',
                element: <PrivateGuard children={<MasterLayout />} />,
                children: [
                    ...modules.map(x => x.Router),
                ]
            },
            {
                element: <PublicGuard children={<AuthLayout />} />,
                children: [
                    Auth.Router
                ]
            },
            // {
            //     element: <PrivateGuard children={<MasterLayout />} />,
            //     children: [
            //         ...modules.map(x => x.Router),
            //     ]
            // },
        ]
    }
], {
    basename: import.meta.env.PUBLIC_URL
})

const Router = () => {
    return (
        <RouterProvider
            router={router}
            fallbackElement={<Loading />}
        />
    )
}


export default Router;

