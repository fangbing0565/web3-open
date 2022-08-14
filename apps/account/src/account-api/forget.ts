import accountSDK from '.';

export const sendEmailCode = ({ email }) => {
  return accountSDK.forgetPwd.sendEmailCode({
    email,
  });
};

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
