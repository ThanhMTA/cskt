import { RouteObject } from 'react-router';
import loadable from '../../components/Loadable';
import { RouterUrl } from '@app/enums/router.enum';

const Login = loadable(() => import('./pages/login/Login'));
const ForgotPassword = loadable(() => import('./pages/forgot-password/ForgotPassword'));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: RouterUrl.Login,
      element: <Login />
    },
    {
      path: 'forgotPassword',
      element: <ForgotPassword />
    }
  ]
}

