import accountSDK from '.';

export const sendPhoneCode = mobile => {
  return accountSDK.login.sendCode({
    mobile,
    registerOnly: true,
  });
};

export const sendEmailCode = ({ email }) => {
  return accountSDK.login.sendEmailCode({
    email,
    extra_params: {
      email_logic_type: '3',
    },
  } as any);
};

export const emailRegister = ({
  email,
  password,
  code,
}: {
  email: string;
  password: string;
  code: string;
}) => {
  return accountSDK.login.emailRegister({
    email,
    password,
    code,
    ifLogin: true,
    extra_params: {
      email_logic_type: '3',
    },
  });
};

type MobileEmailRegisterType = {
  phone: string;
  phoneCode: string;
  email: string;
  emailCode: string;
  password: string;
  verify_ticket?: string;
};

export const mobileEmailRegister = ({
  phone,
  phoneCode,
  email,
  emailCode,
  password,
  verify_ticket,
}: MobileEmailRegisterType) => {
  return accountSDK.login.mobileEmailRegister({
    mobile: phone,
    sms_code: phoneCode,
    email,
    email_code: emailCode,
    password,
    verify_ticket,
    extra_params: {
      email_logic_type: '3',
    },
  });
};
