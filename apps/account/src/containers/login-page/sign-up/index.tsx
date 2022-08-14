import React from 'react';
import FormPage from '@/components/form-page';
import LoginNavBar from '../../../components/login-nav-bar/index';
import { Input, Button } from '@m4b-design/components';
import ProForm from '@m4b-design/pearl-pro-form';
import SendCodeInput from '@/components/send-code';
import PhoneInput from '../../../components/phone-input/index';
import styles from './index.scss';
import { ACCOUNT_PATH } from '@/constants/paths';
import TooltipAlert from '@m4b-design/alert';
import { Link, useHistory } from '@jupiter/plugin-runtime/router';
import { ACCOUNT_PATH_LIST } from '../../../constants/paths';
import { PasswordBody } from '../../../components/password-form/index';
import {
  validatorEmail,
  onRequestLoginError,
  onChangeLoginForm,
} from '../../../utils/validation';
import { LOGIN_FORM_FIELD } from '@/constants/error-code';
import {
  emailRegister,
  mobileEmailRegister,
  sendEmailCode,
  sendPhoneCode,
} from '../../../account-api/sign';
import { IconLoading } from '@arco-design/web-react/icon';

export type ErrorMessageType = {
  field: string;
  content: string | React.ReactNode;
} | null;

const SigninForm = () => {
  const [formRef] = ProForm.useForm();
  const [loading, setLoading] = React.useState(false);
  const [isRequiredPhone, setIsRequiredPhone] = React.useState(false);
  const [emailAlertVisible, setEmailAlertVisible] = React.useState(false);
  const [phoneAlertVisible, setPhoneAlertVisible] = React.useState(false);
  const [currentEmail, setCurrentEmail] = React.useState('');
  const [currentPhone, setCurrentPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<ErrorMessageType>();
  const history = useHistory();

  const onChangeForm = React.useCallback(
    () =>
      onChangeLoginForm({
        formRef,
        errorMessage,
        setErrorMessage,
      }),
    [formRef, errorMessage, setErrorMessage],
  );

  const onSubmit = React.useCallback(() => {
    const email = formRef.getFieldValue(LOGIN_FORM_FIELD.EMAIL);
    const emailCode = formRef.getFieldValue(LOGIN_FORM_FIELD.EMAIL_CODE);
    const dialCode = formRef.getFieldValue(LOGIN_FORM_FIELD.PHONE_DIAL_CODE);
    const phoneNumber = formRef.getFieldValue(LOGIN_FORM_FIELD.PHONE_NUMBER);
    const phoneCode = formRef.getFieldValue(LOGIN_FORM_FIELD.PHONE_CODE);
    const password = formRef.getFieldValue(LOGIN_FORM_FIELD.PASSWORD);

    if (password.length < 6 || password.length > 16) {
      return;
    }

    if (!/^[0-9a-zA-Z]*$/.test(password)) {
      return;
    }

    if (!/[A-Z]/.test(password)) {
      return;
    }

    setLoading(true);
    const api =
      phoneNumber && phoneCode
        ? mobileEmailRegister({
            phone: `${dialCode ? dialCode + ' ' : ''}${phoneNumber}`,
            phoneCode,
            email,
            emailCode,
            password,
          })
        : emailRegister({ email, password, code: emailCode });
    api
      .then(() => {
        history.push(ACCOUNT_PATH_LIST.ACCOUNT_LOGIN);
      })
      .catch(error => {
        onRequestLoginError({ error, formRef, setErrorMessage });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [formRef]);

  return (
    <ProForm form={formRef} onChange={onChangeForm} onSubmit={onSubmit}>
      <ProForm.Item
        field={LOGIN_FORM_FIELD.EMAIL}
        label="Email"
        required={true}
        rules={[
          {
            validator: (value, cb) => validatorEmail(value, cb, errorMessage),
          },
        ]}>
        <Input
          placeholder="Please enter the email"
          onChange={val => {
            setEmail(val);
          }}
        />
      </ProForm.Item>
      <SendCodeInput
        errorMessage={errorMessage}
        required={true}
        label="Verification code"
        field={LOGIN_FORM_FIELD.EMAIL_CODE}
        disabledSendCode={email === ''}
        sendCodeValidator={() =>
          new Promise((resolve: any, reject) => {
            formRef.validate([LOGIN_FORM_FIELD.EMAIL], err => {
              if (err) {
                reject();
              } else {
                resolve();
              }
            });
          })
        }
        requestError={error =>
          onRequestLoginError({ error, formRef, setErrorMessage })
        }
        requestSuccess={() => {
          setCurrentEmail(formRef.getFieldValue(LOGIN_FORM_FIELD.EMAIL));
          setEmailAlertVisible(true);
        }}
        api={() =>
          sendEmailCode({
            email: formRef.getFieldValue(LOGIN_FORM_FIELD.EMAIL),
          })
        }
        placeholder="Please enter the verification code">
        {emailAlertVisible ? (
          <TooltipAlert
            closable
            onClose={() => {
              setEmailAlertVisible(false);
            }}
            className={styles.alertTipWrapper}
            content={
              <div className={styles.alertTips}>
                A verification email has been sent to{' '}
                <span className={styles.alertEmail}>{currentEmail}</span>.
                Please check your email and enter the verification code above.
                Don’t see the email? Check the spam or junk folder to make sure
                it’s not there.
              </div>
            }
            title="Email Verification"
          />
        ) : (
          <></>
        )}
      </SendCodeInput>
      <PhoneInput
        errorMessage={errorMessage}
        formRef={formRef}
        onChangeForm={onChangeForm}
        label="Phone number"
        field={LOGIN_FORM_FIELD.PHONE_NUMBER}
        codeField={LOGIN_FORM_FIELD.PHONE_DIAL_CODE}
        required={isRequiredPhone}
        placeholder="Please enter phone number"
        onChange={setPhone}
        phoneValidator={val => {
          if (formRef.getFieldValue(LOGIN_FORM_FIELD.PHONE_CODE) && !val) {
            return 'Please enter your phone number to continue the process.';
          }
          return '';
        }}
      />
      <SendCodeInput
        errorMessage={errorMessage}
        field={LOGIN_FORM_FIELD.PHONE_CODE}
        label="Verification code"
        disabledSendCode={phone === ''}
        sendCodeValidator={() => {
          return new Promise((resolve: any, reject) => {
            setIsRequiredPhone(true);
            setTimeout(() => {
              formRef.validate([LOGIN_FORM_FIELD.PHONE_NUMBER], err => {
                setIsRequiredPhone(false);
                if (err) {
                  reject();
                } else {
                  resolve();
                }
              });
            });
          });
        }}
        requestError={error =>
          onRequestLoginError({ error, formRef, setErrorMessage })
        }
        placeholder="Please enter the verification code"
        requestSuccess={() => {
          const phoneDialCode = formRef.getFieldValue(
            LOGIN_FORM_FIELD.PHONE_DIAL_CODE,
          );
          const phoneNumber = formRef.getFieldValue(
            LOGIN_FORM_FIELD.PHONE_NUMBER,
          );
          setCurrentPhone(
            `${phoneDialCode ? phoneDialCode + ' ' : ''}${phoneNumber}`,
          );
          setPhoneAlertVisible(true);
        }}
        validator={val => {
          if (formRef.getFieldValue(LOGIN_FORM_FIELD.PHONE_NUMBER) && !val) {
            return 'Please enter your verification code to continue the process.';
          }
          return '';
        }}
        api={() => {
          const phoneDialCode = formRef.getFieldValue(
            LOGIN_FORM_FIELD.PHONE_DIAL_CODE,
          );
          const phoneNumber = formRef.getFieldValue(
            LOGIN_FORM_FIELD.PHONE_NUMBER,
          );
          const mobile = `${
            phoneDialCode ? phoneDialCode + ' ' : ''
          }${phoneNumber}`;
          return sendPhoneCode(mobile);
        }}>
        {phoneAlertVisible ? (
          <TooltipAlert
            closable
            onClose={() => {
              setPhoneAlertVisible(false);
            }}
            className={styles.alertTipWrapper}
            content={
              <div className={styles.alertTips}>
                A verification code has been sent to{' '}
                <span className={styles.alertEmail}>{currentPhone}</span>.
                Please check your SMS and enter the verification code above.
                Don’t see the message? Check the spam or junk folder to make
                sure it’s not there.
              </div>
            }
            title="Email Verification"
          />
        ) : (
          <></>
        )}
      </SendCodeInput>
      <PasswordBody
        isReset={false}
        formRef={formRef}
        errorMessage={errorMessage}
      />
      <div className={styles.submitWrapper}>
        <Button
          disabled={loading}
          type="primary"
          htmlType="submit"
          className={styles.submitButton}>
          {loading ? <IconLoading /> : 'Create'}
        </Button>
        <div className={styles.tips}>
          By continuing, you acknowledge and accept the{' '}
          <a className={styles.link} href="#">
            Partner Terms of Service for Partner Platform, TikTok Commercial
            Terms of Service
          </a>
          and acknowledge that your personal data will be collected and
          processed in accordance with the{' '}
          <a className={styles.link} href="#">
            TikTok Shop Partner Platform Privacy Policy, TikTok For Business
            Privacy Policy.
          </a>
        </div>
      </div>
    </ProForm>
  );
};

const SignUpPage = () => {
  // const [step, setStep] = React.useState(0);

  return (
    <div className={styles.pageWarpper}>
      <LoginNavBar />
      <FormPage
        title={ACCOUNT_PATH.accountSignUp.name}
        titleChildren={
          <div className={styles.login}>
            Already a member?
            <Link
              to={ACCOUNT_PATH_LIST.ACCOUNT_LOGIN}
              className={styles.loginButton}>
              Log in
            </Link>
          </div>
        }>
        {/* {step === 0 ? ( */}
        <SigninForm />
        {/* ) : (
          <PasswordForm
            onSubmit={() => {
              console.log(' on signin submit ');
            }}
          />
        )} */}
      </FormPage>
    </div>
  );
};

export default SignUpPage;

// TODO: signin validator, show log in button
// The email address you entered is already signed up. Log in
