export const ACCOUNT_PATH_LIST = {
    ACCOUNT: '/account/',
    ACCOUNT_LOGIN: '/account/login',
    ACCOUNT_SIGN_UP: '/account/sign-up',
    ACCOUNT_FORGOT_PASSWORD: '/account/forgot-password',
    ACCOUNT_LOGIN_SUCCESS_PATH: '/approval/profile',
  };
  
  export const ACCOUNT_PATH = {
    account: {
      path: ACCOUNT_PATH_LIST.ACCOUNT,
      name: 'Account',
    },
    accountLogin: {
      path: ACCOUNT_PATH_LIST.ACCOUNT_LOGIN,
      name: 'Log in',
    },
    accountSignUp: {
      path: ACCOUNT_PATH_LIST.ACCOUNT_SIGN_UP,
      name: 'Sign up',
    },
    accountForgotPassword: {
      path: ACCOUNT_PATH_LIST.ACCOUNT_FORGOT_PASSWORD,
      name: 'Forgot Password',
    },
  };
  