import { ERROR_CODE, LOGIN_FORM_FIELD } from '@/constants/error-code';
import { errorCode2Info } from '../constants/error-code';
import { Message } from '@m4b-design/components';

export type ErrorInfoType = {
  description: string;
  error_code: ERROR_CODE;
};

export const validatorEmail: any = (val, cb, errorMessage) => {
  if (errorMessage?.field === LOGIN_FORM_FIELD.EMAIL) {
    return cb(errorMessage?.content);
  }

  if (!val) {
    return cb('Please enter an emaill address to continue the process.');
  }

  if (
    !/^[a-zA-Z0-9_.-]+(\+[a-zA-Z0-9-]+)?@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
      val,
    )
  ) {
    return cb('Please make sure your email address is correct.');
  }

  return cb();
};

let clearErrorTimeout: any;

export const onRequestLoginError = ({ error, formRef, setErrorMessage }) => {
  clearTimeout(clearErrorTimeout);
  const { error_code } = error;
  const { field, content } = errorCode2Info(error);
  if (
    error_code === ERROR_CODE.PASSWORD_ERROR_MORE_TIMES ||
    error_code === ERROR_CODE.PASSWORD_ERROR_MORE_TIMES_1
  ) {
    clearErrorTimeout = setTimeout(() => {
      setErrorMessage(null);
      formRef.validate([field]);
    }, 1000 * 60 * 30);
  }
  if (field) {
    setErrorMessage({
      field,
      content,
    });
    formRef.validate([field]);
  } else {
    Message.error(error?.description);
  }
};

export const onChangeLoginForm = ({
  formRef,
  errorMessage,
  setErrorMessage,
}) => {
  setTimeout(() => {
    setErrorMessage(null);
    if (errorMessage?.field) {
      formRef.validate([errorMessage?.field]);
    }
  });
};
