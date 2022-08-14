import React, { PropsWithChildren } from 'react';
import styles from './index.scss';
import LoginNavBar from '../../../components/login-nav-bar/index';
import FormPage from '../../../components/form-page/index';
import { ACCOUNT_PATH } from '@/constants/paths';
import { ACCOUNT_PATH_LIST } from '../../../constants/paths';
import { Link } from '@jupiter/plugin-runtime/router';
import ProForm from '@m4b-design/pearl-pro-form';
import { Input, Button, Message } from '@m4b-design/components';
import {
  onChangeLoginForm,
  validatorEmail,
  onRequestLoginError,
} from '../../../utils/validation';
import { PasswordInput } from '@/components/password-form';
import SendCodeInput from '../../../components/send-code/index';
import PhoneInput from '../../../components/phone-input/index';
import { LOGIN_METHODS } from '@/constants/login-methods';
import {
  emailCodeLogin,
  loginEmailPassword,
  pwdLogin,
  sendEmailCode,
  sendPhoneCode,
  smsLogin,
} from '../../../account-api/login';
import { IconLoading } from '@arco-design/web-react/icon';
import { LOGIN_FORM_FIELD } from '@/constants/error-code';
import { ErrorMessageType } from '@/containers/login-page/sign-up';

type MethodLoginType = {
  loginMethod: LOGIN_METHODS;
  setLoginMethod?: (val: LOGIN_METHODS) => void;
  onSubmit: (val: LOGIN_METHODS) => Promise<any>;
  showLinks?: boolean;
  submitButton?: string;
  onSubmitSuccess?: () => void;
};

export const EmailLogin: React.FC<PropsWithChildren<MethodLoginType>> = ({
  loginMethod,
  setLoginMethod,
  onSubmit,
  showLinks = true,
  submitButton = 'Log in',
  onSubmitSuccess,
}) => {
  const [loginForm] = ProForm.useForm();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<ErrorMessageType>();
  return (
    <div className={styles.formWrapper}>
      {showLinks ? (
        <div className={styles.formWrapperLink}>
          <Button
            type="text"
            onClick={() => {
              setLoginMethod?.(LOGIN_METHODS.PHONE_PASSWORD);
            }}>
            Log in with phone number
          </Button>
        </div>
      ) : (
        <></>
      )}
      <ProForm
        form={loginForm}
        onChange={() => {
          onChangeLoginForm({
            formRef: loginForm,
            errorMessage,
            setErrorMessage,
          });
        }}
        onSubmit={form => {
          setLoading(true);
          onSubmit(form)
            .then(() => {
              onSubmitSuccess?.();
            })
            .catch(error => {
              setLoading(false);
              onRequestLoginError({
                error,
                formRef: loginForm,
                setErrorMessage,
              });
            });
        }}>
        <ProForm.Item
          label="Email"
          field={LOGIN_FORM_FIELD.EMAIL}
          required
          rules={[
            {
              validator: (value, cb) => validatorEmail(value, cb, errorMessage),
            },
          ]}>
          <Input
            placeholder="Please enter email"
            onChange={val => {
              setEmail(val);
            }}></Input>
        </ProForm.Item>
        {loginMethod === LOGIN_METHODS.EMAIL_PASSWORD ? (
          <>
            <ProForm.Item
              label="Password"
              field={LOGIN_FORM_FIELD.PASSWORD}
              required
              rules={[
                {
                  validator(val, cb) {
                    if (!val) {
                      return cb(
                        'Please enter your password to continue the process.',
                      );
                    }

                    if (errorMessage?.field === LOGIN_FORM_FIELD.PASSWORD) {
                      return cb(errorMessage?.content);
                    }

                    return cb();
                  },
                },
              ]}>
              <PasswordInput placeholder="Please enter the password" />
            </ProForm.Item>
            {showLinks ? (
              <div className={styles.links}>
                <div className={styles.link}>
                  <Link
                    to={ACCOUNT_PATH_LIST.ACCOUNT_FORGOT_PASSWORD}
                    className={styles.linkText}>
                    Forget password?
                  </Link>
                </div>
                <div className={styles.link}>
                  <span
                    className={styles.linkText}
                    onClick={() => {
                      setLoginMethod?.(LOGIN_METHODS.EMAIL_CODE);
                    }}>
                    Log in with code
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <SendCodeInput
              errorMessage={errorMessage}
              required={true}
              api={() =>
                sendEmailCode(loginForm.getFieldValue(LOGIN_FORM_FIELD.EMAIL))
              }
              disabledSendCode={email === ''}
              sendCodeValidator={() =>
                new Promise((resolve: any, reject) => {
                  loginForm.validate([LOGIN_FORM_FIELD.EMAIL], err => {
                    if (err) {
                      reject();
                    } else {
                      resolve();
                    }
                  });
                })
              }
              requestError={error =>
                onRequestLoginError({
                  error,
                  formRef: loginForm,
                  setErrorMessage,
                })
              }
              placeholder="Please enter verification code"
              label="Verification Code"
              field={LOGIN_FORM_FIELD.EMAIL_CODE}
            />
            {showLinks ? (
              <div className={styles.links}>
                <div className={styles.link}>
                  <span
                    className={styles.linkText}
                    onClick={() => {
                      setLoginMethod?.(LOGIN_METHODS.EMAIL_PASSWORD);
                    }}>
                    Log in with password
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
        <div className={styles.buttonWrapper}>
          <Button
            htmlType="submit"
            className={styles.button}
            type="primary"
            disabled={loading}>
            {loading ? <IconLoading /> : submitButton}
          </Button>
        </div>
      </ProForm>
    </div>
  );
};

const PhoneLogin = ({
  loginMethod,
  setLoginMethod,
  onSubmit,
  onSubmitSuccess,
}) => {
  const [loginForm] = ProForm.useForm();
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<ErrorMessageType>();
  const onChangeForm = React.useCallback(
    () =>
      onChangeLoginForm({
        formRef: loginForm,
        errorMessage,
        setErrorMessage,
      }),
    [loginForm, errorMessage, setErrorMessage],
  );
  return (
    <div className={styles.formWrapper}>
      <div className={styles.formWrapperLink}>
        <Button
          type="text"
          onClick={() => {
            setLoginMethod(LOGIN_METHODS.EMAIL_PASSWORD);
          }}>
          Log in with email
        </Button>
      </div>
      <ProForm
        form={loginForm}
        onChange={onChangeForm}
        onSubmit={form => {
          setLoading(true);
          onSubmit(form)
            .then(() => {
              onSubmitSuccess?.();
            })
            .catch(error => {
              setLoading(false);
              onRequestLoginError({
                error,
                formRef: loginForm,
                setErrorMessage,
              });
            });
        }}>
        <PhoneInput
          formRef={loginForm}
          onChange={setPhone}
          label="Phone number"
          field={LOGIN_FORM_FIELD.PHONE_NUMBER}
          codeField={LOGIN_FORM_FIELD.PHONE_DIAL_CODE}
          required={true}
          placeholder="Please enter phone number"
          errorMessage={errorMessage}
          onChangeForm={onChangeForm}
        />
        {loginMethod === LOGIN_METHODS.PHONE_PASSWORD ? (
          <>
            <ProForm.Item
              label="Password"
              field={LOGIN_FORM_FIELD.PASSWORD}
              required
              rules={[
                {
                  validator(val, cb) {
                    if (errorMessage?.field === LOGIN_FORM_FIELD.PASSWORD) {
                      return cb(errorMessage?.content);
                    }

                    if (!val) {
                      return cb(
                        'Please enter your password to continue the process.',
                      );
                    }
                    return cb();
                  },
                },
              ]}>
              <PasswordInput placeholder="Please enter the password" />
            </ProForm.Item>
            <div className={styles.links}>
              <div className={styles.link}>
                <Link
                  to={ACCOUNT_PATH_LIST.ACCOUNT_FORGOT_PASSWORD}
                  className={styles.linkText}>
                  Forget password?
                </Link>
              </div>
              <div className={styles.link}>
                <span
                  className={styles.linkText}
                  onClick={() => {
                    setLoginMethod(LOGIN_METHODS.PHONE_CODE);
                  }}>
                  Log in with code
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <SendCodeInput
              errorMessage={errorMessage}
              required={true}
              api={() => {
                const dialCode = loginForm.getFieldValue(
                  LOGIN_FORM_FIELD.PHONE_DIAL_CODE,
                );
                return sendPhoneCode(
                  `${dialCode ? dialCode + ' ' : ''}${loginForm.getFieldValue(
                    LOGIN_FORM_FIELD.PHONE_NUMBER,
                  )}`,
                );
              }}
              disabledSendCode={phone === ''}
              sendCodeValidator={() =>
                new Promise((resolve: any, reject) => {
                  loginForm.validate(['email'], err => {
                    if (err) {
                      reject();
                    } else {
                      resolve();
                    }
                  });
                })
              }
              requestError={error =>
                onRequestLoginError({
                  error,
                  formRef: loginForm,
                  setErrorMessage,
                })
              }
              placeholder="Please enter verification code"
              label="Verification Code"
              field={LOGIN_FORM_FIELD.PHONE_CODE}
            />
            <div className={styles.links}>
              <div className={styles.link}>
                <span
                  className={styles.linkText}
                  onClick={() => {
                    setLoginMethod(LOGIN_METHODS.PHONE_PASSWORD);
                  }}>
                  Log in with password
                </span>
              </div>
            </div>
          </>
        )}
        <div className={styles.buttonWrapper}>
          <Button
            htmlType="submit"
            className={styles.button}
            type="primary"
            disabled={loading}>
            {loading ? <IconLoading /> : 'Log in'}
          </Button>
        </div>
      </ProForm>
    </div>
  );
};

const LoginFormContent = () => {
  const [loginMethod, setLoginMethod] = React.useState<LOGIN_METHODS>(
    LOGIN_METHODS.EMAIL_PASSWORD,
  );

  const onSubmit = React.useCallback(
    form => {
      if (loginMethod === LOGIN_METHODS.EMAIL_PASSWORD) {
        return loginEmailPassword(form);
      } else if (loginMethod === LOGIN_METHODS.EMAIL_CODE) {
        return emailCodeLogin({
          email: form[LOGIN_FORM_FIELD.EMAIL],
          code: form[LOGIN_FORM_FIELD.EMAIL_CODE],
        });
      } else if (loginMethod === LOGIN_METHODS.PHONE_CODE) {
        const dialCode = form[LOGIN_FORM_FIELD.PHONE_DIAL_CODE];
        return smsLogin({
          phone: `${dialCode ? dialCode + ' ' : ''}${
            form[LOGIN_FORM_FIELD.PHONE_NUMBER]
          }`,
          code: form[LOGIN_FORM_FIELD.PHONE_CODE],
        });
      } else {
        const dialCode = form[LOGIN_FORM_FIELD.PHONE_DIAL_CODE];
        return pwdLogin({
          phone: `${dialCode ? dialCode + ' ' : ''}${
            form[LOGIN_FORM_FIELD.PHONE_NUMBER]
          }`,
          password: form[LOGIN_FORM_FIELD.PASSWORD],
        });
      }
    },
    [loginMethod],
  );

  const onSubmitSuccess = React.useCallback(() => {
    Message.success('Log in successful.');
    // history.push(ACCOUNT_PATH_LIST.ACCOUNT_LOGIN_SUCCESS_PATH);
    history.pushState(null, '', ACCOUNT_PATH_LIST.ACCOUNT_LOGIN_SUCCESS_PATH);
    const evt = new PopStateEvent('popstate', {});
    window.dispatchEvent(evt);
  }, []);

  if (
    loginMethod === LOGIN_METHODS.PHONE_CODE ||
    loginMethod === LOGIN_METHODS.PHONE_PASSWORD
  ) {
    return (
      <PhoneLogin
        loginMethod={loginMethod}
        setLoginMethod={setLoginMethod}
        onSubmit={onSubmit}
        onSubmitSuccess={onSubmitSuccess}
      />
    );
  } else {
    return (
      <EmailLogin
        loginMethod={loginMethod}
        setLoginMethod={setLoginMethod}
        onSubmit={onSubmit}
        onSubmitSuccess={onSubmitSuccess}
      />
    );
  }
};

const LoginPage = () => {
  return (
    <div className={styles.pageWarpper}>
      <LoginNavBar />
      <FormPage
        title={ACCOUNT_PATH.accountLogin.name}
        titleChildren={
          <div className={styles.login}>
            Do not have an account?
            <Link
              to={ACCOUNT_PATH_LIST.ACCOUNT_SIGN_UP}
              className={styles.loginButton}>
              Sign up
            </Link>
          </div>
        }>
        <LoginFormContent />
      </FormPage>
    </div>
  );
};

export default LoginPage;
