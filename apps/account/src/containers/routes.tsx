import React from 'react';
import { Redirect } from '@jupiter/plugin-runtime/router';
import { ACCOUNT_PATH } from '@/constants/paths';
import loginPath from './login-page';

export const profileRouters = [
  {
    name: ACCOUNT_PATH.account.name,
    path: ACCOUNT_PATH.account.path,
    sidebar: false,
    navbar: false,
    render: () => {
      return <Redirect to={ACCOUNT_PATH.accountLogin.path} />;
    },
    routes: [...loginPath],
  },
];
