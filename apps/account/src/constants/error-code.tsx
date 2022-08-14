import { Link } from '@jupiter/plugin-runtime/router';
import React, { ReactNode } from 'react';
import { ACCOUNT_PATH_LIST } from './paths';
import { ErrorInfoType } from '@/utils/validation';

export enum LOGIN_FORM_FIELD {
  EMAIL = 'email',
  EMAIL_CODE = 'emailCode',
  PHONE_DIAL_CODE = 'phoneDialCode',
  PHONE_NUMBER = 'phoneNumber',
  PHONE_CODE = 'phoneCode',
  PASSWORD = 'password',
}

export enum ERROR_CODE {
  EMAIL_FORMAT_ERROR = 1031,
  EMAIL_FORMAT_ERROR_1 = 1044,
  EMAIL_EXISTS = 1023,
  EMAIL_EXISTS_1 = 1320,
  EMAIL_CODE_FORMAT_ERROR = 1016,
  EMAIL_CODE_ERROE = 1704,
  EMAIL_CORE_EXPIRE = 1703,
  PHONE_FORMAT_ERROR = 1003,
  PHONE_EXISTS = 1001,
  PHONE_EXISTS_1 = 1035,
  PHONE_EXISTS_2 = 1057,
  PHONE_EXISTS_3 = 1421,
  PHONE_CODE_FORMAT_ERROR = 1204,
  PHONE_CODE_ERROR = 1202,
  PHONE_CODE_EXPIRE = 1203,
  EMAIL_NOT_EXITS = 1006,
  EMAIL_NOT_EXITS_1 = 1008,
  EMAIL_NOT_EXITS_2 = 1011,
  PASSWORD_ERROR_MORE_TIMES = 1034,
  PASSWORD_ERROR_MORE_TIMES_1 = 1399,
  PASSWORD_ERROR = 1009,
  PASSWORD_ERROR_1 = 1033,
  PHONE_NOT_EXISTS = 1054,
}

const SignContent = (
  <div style={{ color: '#FF4D4A' }}>
    Can’t find your account with this email address. Not registered yet?{' '}
    <Link
      to={ACCOUNT_PATH_LIST.ACCOUNT_SIGN_UP}
      style={{
        color: '#5245E5',
        fontWeight: '600',
        textDecoration: 'none',
      }}>
      Sign up
    </Link>
  </div>
);

const LoginContent = (
  <div style={{ color: '#FF4D4A' }}>
    The email address you entered is already signed up.{' '}
    <Link
      to={ACCOUNT_PATH_LIST.ACCOUNT_LOGIN}
      style={{
        color: '#5245E5',
        fontWeight: '600',
        textDecoration: 'none',
      }}>
      Log in
    </Link>
  </div>
);

export const errorCodeInfo: {
  [key: number]: {
    content: string | ReactNode | undefined;
    field: string;
  };
} = {
  [ERROR_CODE.EMAIL_EXISTS_1]: {
    content: LoginContent,
    field: LOGIN_FORM_FIELD.EMAIL,
  },
  [ERROR_CODE.EMAIL_EXISTS]: {
    content: LoginContent,
    field: LOGIN_FORM_FIELD.EMAIL,
  },
  [ERROR_CODE.EMAIL_NOT_EXITS]: {
    content: SignContent,
    field: LOGIN_FORM_FIELD.EMAIL,
  },
  [ERROR_CODE.EMAIL_NOT_EXITS_1]: {
    content: SignContent,
    field: LOGIN_FORM_FIELD.EMAIL,
  },
  [ERROR_CODE.EMAIL_NOT_EXITS_2]: {
    content: SignContent,
    field: LOGIN_FORM_FIELD.EMAIL,
  },
  [ERROR_CODE.EMAIL_FORMAT_ERROR]: {
    content: 'Please make sure your email address is correct.',
    field: LOGIN_FORM_FIELD.EMAIL,
  },
  [ERROR_CODE.EMAIL_FORMAT_ERROR_1]: {
    content: 'Please make sure your email address is correct.',
    field: LOGIN_FORM_FIELD.EMAIL,
  },
  [ERROR_CODE.EMAIL_CODE_ERROE]: {
    content: 'Wrong verification code. Please try again.',
    field: LOGIN_FORM_FIELD.EMAIL_CODE,
  },
  [ERROR_CODE.EMAIL_CODE_FORMAT_ERROR]: {
    content: 'Wrong verification code. Please try again.',
    field: LOGIN_FORM_FIELD.EMAIL_CODE,
  },
  [ERROR_CODE.EMAIL_CORE_EXPIRE]: {
    content: 'Verification code has expired. Please resend the code.',
    field: LOGIN_FORM_FIELD.EMAIL_CODE,
  },
  [ERROR_CODE.PHONE_FORMAT_ERROR]: {
    content: 'Wrong format. Please type in again.',
    field: LOGIN_FORM_FIELD.PHONE_NUMBER,
  },
  [ERROR_CODE.PHONE_EXISTS]: {
    content:
      'The phone number you entered is bound to another account. Please try a different number.',
    field: LOGIN_FORM_FIELD.PHONE_NUMBER,
  },
  [ERROR_CODE.PHONE_EXISTS_1]: {
    content:
      'The phone number you entered is bound to another account. Please try a different number.',
    field: LOGIN_FORM_FIELD.PHONE_NUMBER,
  },
  [ERROR_CODE.PHONE_EXISTS_2]: {
    content:
      'The phone number you entered is bound to another account. Please try a different number.',
    field: LOGIN_FORM_FIELD.PHONE_NUMBER,
  },
  [ERROR_CODE.PHONE_EXISTS_3]: {
    content:
      'The phone number you entered is bound to another account. Please try a different number.',
    field: LOGIN_FORM_FIELD.PHONE_NUMBER,
  },
  [ERROR_CODE.PHONE_CODE_FORMAT_ERROR]: {
    content: 'Invalid code. Please try again.',
    field: LOGIN_FORM_FIELD.PHONE_CODE,
  },
  [ERROR_CODE.PHONE_CODE_ERROR]: {
    content: 'Invalid code. Please try again.',
    field: LOGIN_FORM_FIELD.PHONE_CODE,
  },
  [ERROR_CODE.PHONE_CODE_EXPIRE]: {
    content: 'Wrong verification code. Please try again.',
    field: LOGIN_FORM_FIELD.PHONE_CODE,
  },
  [ERROR_CODE.PASSWORD_ERROR_MORE_TIMES]: {
    content:
      'Wrong account or password entered too many times, please try again in 30 minutes.',
    field: LOGIN_FORM_FIELD.PASSWORD,
  },
  [ERROR_CODE.PASSWORD_ERROR_MORE_TIMES_1]: {
    content:
      'Wrong account or password entered too many times, please try again in 30 minutes.',
    field: LOGIN_FORM_FIELD.PASSWORD,
  },
  [ERROR_CODE.PASSWORD_ERROR]: {
    content: undefined,
    field: LOGIN_FORM_FIELD.PASSWORD,
  },
  [ERROR_CODE.PASSWORD_ERROR_1]: {
    content: undefined,
    field: LOGIN_FORM_FIELD.PASSWORD,
  },
  [ERROR_CODE.PHONE_NOT_EXISTS]: {
    content: 'Can’t find your account with this phone number.',
    field: LOGIN_FORM_FIELD.PHONE_NUMBER,
  },
};

export const errorCode2Info = (errorInfo: ErrorInfoType) => {
  const { error_code, description } = errorInfo;
  const error = errorCodeInfo?.[error_code];
  if (error) {
    const { content, field } = error;
    return {
      field,
      content: content || description,
    };
  }
  return {};
};
