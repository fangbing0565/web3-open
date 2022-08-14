import React from 'react';
import { ACCOUNT_PATH } from '@/constants/paths';
import SignUpPage from './sign-up/index';
import LoginPage from './log-in/index';
import ForgotPasswordPage from './forgot-password/index';

const loginPath = [
  {
    name: ACCOUNT_PATH.accountSignUp.name,
    path: ACCOUNT_PATH.accountSignUp.path,
    sidebar: false,
    navbar: false,
    render: () => <SignUpPage />,
  },
  {
    name: ACCOUNT_PATH.accountLogin.name,
    path: ACCOUNT_PATH.accountLogin.path,
    sidebar: false,
    navbar: false,
    render: () => <LoginPage />,
  },
  {
    name: ACCOUNT_PATH.accountForgotPassword.name,
    path: ACCOUNT_PATH.accountForgotPassword.path,
    sidebar: false,
    navbar: false,
    render: () => <ForgotPasswordPage />,
  },
];

export default loginPath;
