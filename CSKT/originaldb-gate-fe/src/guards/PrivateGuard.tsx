import React, { Fragment, ReactElement, ReactNode } from 'react';
import { Navigate } from 'react-router';
import { LOCAL_USER_KEY } from '@app/configs/auth.config';
import cache from '@app/core/cache';
import { RouterUrl } from '@app/enums/router.enum';

type Props = {
  children: ReactNode | ReactElement;
}

const PrivateGuard: React.FC<Props> = ({ children }) => {
  const res = cache.getCache(LOCAL_USER_KEY);

  return (
    <Fragment>
      {res && res.data && res.data.token ? (
        <Fragment>{children}</Fragment>
      ) : (
        <Navigate to={RouterUrl.Login} />
      )}
    </Fragment>
  );
}

export { PrivateGuard }