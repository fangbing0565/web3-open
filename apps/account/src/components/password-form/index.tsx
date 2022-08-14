import React, { FC, PropsWithChildren } from 'react';
import styles from './index.scss';
import ProForm from '@m4b-design/pearl-pro-form';
import { Input, Message } from '@m4b-design/components';
import Button from '@m4b-design/button';
import { useHistory } from '@jupiter/plugin-runtime/router';
import { ACCOUNT_PATH_LIST } from '../../constants/paths';
import { LOGIN_FORM_FIELD } from '@/constants/error-code';
import { ErrorMessageType } from '@/containers/login-page/sign-up';
import {
  IconCheck,
  IconClose,
  IconEye,
  IconEyeInvisible,
  IconLoading,
} from '@arco-design/web-react/icon';
import { onRequestLoginError } from '@/utils/validation';

type PasswordFormType = {
  submitApi: any;
  isReset?: boolean;
  submitSuccess?: () => void;
};

type StatusType = {
  value: string;
  validator: (val: string) => boolean;
};

const Status: React.FC<PropsWithChildren<StatusType>> = ({
  value,
  validator,
}) => {
  if (!value) {
    return <div className={styles.point}></div>;
  }

  if (validator(value)) {
    return <IconCheck className={styles.yes} />;
  }

  return <IconClose className={styles.no} />;
};

const PasswordForm: FC<PropsWithChildren<PasswordFormType>> = ({
  submitApi,
  isReset,
  submitSuccess,
}) => {
  const [formRef] = ProForm.useForm();
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<ErrorMessageType>();
  return (
    <ProForm
      form={formRef}
      onSubmit={() => {
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
        submitApi?.(formRef.getFieldsValue())
          ?.then(() => {
            submitSuccess?.();
          })
          ?.catch(error =>
            onRequestLoginError({
              error,
              formRef: formRef,
              setErrorMessage,
            }),
          )
          ?.finally(() => {
            setLoading(false);
          });
      }}>
      <PasswordBody
        isReset={isReset}
        formRef={formRef}
        errorMessage={errorMessage}
      />
      <div className={styles.buttonWrapper}>
        <Button
          disabled={loading}
          htmlType="submit"
          className={styles.button}
          type="primary">
          {!loading ? 'Create' : <IconLoading />}
        </Button>
      </div>
    </ProForm>
  );
};

type PasswordBody = {
  isReset: boolean;
  formRef: any;
};

export const PasswordBody = ({ isReset, formRef, errorMessage }) => {
  const [password, setPassword] = React.useState('');
  const isPass = React.useMemo(() => {
    if (!password) {
      return true;
    }
    if (password.length < 6 || password.length > 16) {
      return false;
    }

    if (!/^[0-9a-zA-Z]*$/.test(password)) {
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      return false;
    }

    return true;
  }, [password]);
  return (
    <>
      <ProForm.Item
        label={`${isReset ? 'New' : 'Create'} password`}
        field="password"
        required
        validateStatus={isPass ? '' : ('error' as any)}
        rules={[
          {
            validator(val, cb) {
              if (errorMessage?.field === LOGIN_FORM_FIELD.PASSWORD) {
                return cb(errorMessage?.content);
              }
              if (!val) {
                return cb('Please enter a password to continue the process.');
              }

              return cb();
            },
          },
        ]}>
        <PasswordInput
          placeholder={`Enter the ${isReset ? 'new ' : ''}password`}
          onChange={val => {
            setPassword(val);
            if (formRef.getFieldValue('rePassword')) {
              formRef.validate(['rePassword']);
            }
          }}
        />
      </ProForm.Item>
      <div className={styles.statusList}>
        <div className={styles.statusWrapper}>
          <Status
            value={password}
            validator={val => val.length >= 6 && val.length <= 16}
          />
          <div className={styles.statusDesc}>
            Password length must be 6-16 characters
          </div>
        </div>
        <div className={styles.statusWrapper}>
          <Status
            value={password}
            validator={val => /^[0-9a-zA-Z]*$/.test(val)}
          />
          <div className={styles.statusDesc}>
            Can only contain numbers and letters
          </div>
        </div>
        <div className={styles.statusWrapper}>
          <Status value={password} validator={val => /[A-Z]/.test(val)} />
          <div className={styles.statusDesc}>
            Contains at least one CAPITAL letter
          </div>
        </div>
      </div>
      <ProForm.Item
        label={`Confirm ${isReset ? 'new ' : ''}password`}
        field="rePassword"
        required
        rules={[
          {
            validator(val, cb) {
              if (!val) {
                return cb(
                  'Please re-enter the password and make sure it matches with the one above.',
                );
              }

              if (formRef.getFieldValue('password') !== val) {
                return cb('Please make sure two passwords match.');
              }

              return cb();
            },
          },
        ]}>
        <PasswordInput placeholder="Re-enter the password" />
      </ProForm.Item>
    </>
  );
};

export const PasswordInput = props => {
  const [visible, setVisible] = React.useState(false);

  return (
    <Input
      {...props}
      type={visible ? '' : 'password'}
      suffix={
        <div
          className={styles.passwordIconWrapper}
          onClick={() => {
            setVisible(!visible);
          }}>
          {visible ? (
            <IconEye className={styles.passwordIcon} />
          ) : (
            <IconEyeInvisible className={styles.passwordIcon} />
          )}
        </div>
      }></Input>
  );
};

export default PasswordForm;
