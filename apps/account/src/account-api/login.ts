import accountSDK from '.';

export const loginEmailPassword = ({ email, password }) => {
  return accountSDK.login.emailLogin({
    email,
    password,
  });
};

export const emailCodeLogin = ({ email, code }) => {
  return accountSDK.login.emailCodeLogin({
    email,
    code,
  });
};

export const sendEmailCode = email => {
  return accountSDK.login.sendEmailLoginCode({
    email,
  });
};

export const sendPhoneCode = mobile => {
  return accountSDK.login.sendCode({
    mobile,
  });
};

export const smsLogin = ({ phone, code }) => {
  return accountSDK.login.smsLogin({
    login_only: true,
    mobile: phone,
    code,
  });
};

export const pwdLogin = ({ phone, password }) => {
  return accountSDK.login.pwdLogin({
    account: phone,
    password,
  });
};
