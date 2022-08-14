import accountSDK from '.';
import { ACCOUNT_LOGIN } from '@/constants/vars';
import { useHistory } from 'react-router';

export const validateEmail = ({ email, code }) => {
  return accountSDK.forgetPwd.validateEmail({
    email,
    code,
  });
};

export const resetPwdByEmailTicket = ({ password, ticket }) => {
  return accountSDK.forgetPwd.resetPwdByEmailTicket({
    password,
    ticket,
  });
};

export const logoutApi = () => {
  setTimeout(() => {
    window.location.href = ACCOUNT_LOGIN;
  });
  return accountSDK.login.logout({
    next: window.location.host + ACCOUNT_LOGIN,
  });
};

export const getAccountInfo = () => {
  return accountSDK.account.getAccountInfo({});
};
