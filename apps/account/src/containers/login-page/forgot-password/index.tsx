import React from 'react';
import styles from './index.scss';
import LoginNavBar from '../../../components/login-nav-bar/index';
import FormPage from '../../../components/form-page/index';
import { ACCOUNT_PATH } from '@/constants/paths';
import { ACCOUNT_PATH_LIST } from '../../../constants/paths';
import ProForm from '@m4b-design/pearl-pro-form';
import { Input, Message } from '@m4b-design/components';
import { validatorEmail } from '../../../utils/validation';
import SendCodeInput from '../../../components/send-code/index';
import TooltipAlert from '@m4b-design/alert';
import Button from '@m4b-design/button';
import PasswordForm from '@/components/password-form';
import { onChangeLoginForm, onRequestLoginError } from '@/utils/validation';
import { ErrorMessageType } from '../sign-up';
import { LOGIN_FORM_FIELD } from '@/constants/error-code';
import {
  resetPwdByEmailTicket,
  sendEmailCode,
  validateEmail,
} from '@/account-api/forget';
import { IconLoading } from '@arco-design/web-react/icon';
import { useHistory } from '@jupiter/plugin-runtime/router';

const EmailCodeLogin = ({ onSubmitSuccess }) => {
  const [email, setEmail] = React.useState('');
  const [emailAlertVisible, setEmailAlertVisible] = React.useState(false);
  const [currentEmail, setCurrentEmail] = React.useState('');
  const [forgetForm] = ProForm.useForm();
  const [errorMessage, setErrorMessage] = React.useState<ErrorMessageType>();
  const [loading, setLoading] = React.useState(false);

  return (
    <ProForm
      form={forgetForm}
      onChange={() => {
        onChangeLoginForm({
          formRef: forgetForm,
          errorMessage,
          setErrorMessage,
        });
      }}
      onSubmit={() => {
        setLoading(true);
        validateEmail({
          email: forgetForm.getFieldValue(LOGIN_FORM_FIELD.EMAIL),
          code: forgetForm.getFieldValue(LOGIN_FORM_FIELD.EMAIL_CODE),
        })
          .then(res => {
            onSubmitSuccess?.(res?.ticket);
          })
          .catch(error => {
            onRequestLoginError({
              error,
              formRef: forgetForm,
              setErrorMessage,
            });
          })
          .finally(() => {
            setLoading(false);
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
      <SendCodeInput
        errorMessage={errorMessage}
        required={true}
        label="Verification code"
        field={LOGIN_FORM_FIELD.EMAIL_CODE}
        disabledSendCode={email === ''}
        sendCodeValidator={() =>
          new Promise((resolve: any, reject) => {
            forgetForm.validate([LOGIN_FORM_FIELD.EMAIL], err => {
              if (err) {
                reject();
              } else {
                resolve();
              }
            });
          })
        }
        requestError={error =>
          onRequestLoginError({ error, formRef: forgetForm, setErrorMessage })
        }
        requestSuccess={() => {
          setCurrentEmail(forgetForm.getFieldValue(LOGIN_FORM_FIELD.EMAIL));
          setEmailAlertVisible(true);
        }}
        api={() =>
          sendEmailCode({
            email: forgetForm.getFieldValue(LOGIN_FORM_FIELD.EMAIL),
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
      <div className={styles.submitWrapper}>
        <Button
          disabled={loading}
          type="primary"
          htmlType="submit"
          className={styles.submitButton}>
          {loading ? <IconLoading /> : 'Next'}
        </Button>
      </div>
    </ProForm>
  );
};

const ForgotPasswordPage = () => {
  const history = useHistory();
  const [step, setStep] = React.useState(1);
  const [lastTicket, setLastTicket] = React.useState('');
  return (
    <div className={styles.pageWarpper}>
      <LoginNavBar />
      <FormPage
        title={ACCOUNT_PATH.accountForgotPassword.name}
        backName={ACCOUNT_PATH.accountLogin.name}
        backPath={ACCOUNT_PATH_LIST.ACCOUNT_LOGIN}>
        {step === 1 ? (
          <EmailCodeLogin
            onSubmitSuccess={ticket => {
              setLastTicket(ticket);
              setStep(2);
            }}
          />
        ) : (
          <PasswordForm
            isReset={true}
            submitSuccess={() => {
              history.push(ACCOUNT_PATH_LIST.ACCOUNT_LOGIN);
              Message.success('Password saved successfully.');
            }}
            submitApi={form =>
              resetPwdByEmailTicket({
                password: form[LOGIN_FORM_FIELD.PASSWORD],
                ticket: lastTicket,
              })
            }
          />
        )}
      </FormPage>
    </div>
  );
};

export default ForgotPasswordPage;
