import { IconLoading } from '@arco-design/web-react/icon';
import React, { PropsWithChildren, useCallback, useState } from 'react';
import styles from './index.scss';
import { Input } from '@m4b-design/components';
import classNames from 'classnames';
import ProForm from '@m4b-design/pearl-pro-form';
import { ErrorInfoType } from '@/utils/validation';
import { ErrorMessageType } from '@/containers/login-page/sign-up';

type SendCodeButtonType = {
  onClick?: () => void;
  api?: () => Promise<any>;
  sendCodeValidator?: () => Promise<any>;
  requestSuccess?: () => void;
  requestError?: (err: ErrorInfoType) => void;
  disabled?: boolean;
};

const SendCodeButton: React.FC<PropsWithChildren<SendCodeButtonType>> = ({
  onClick,
  api,
  requestSuccess,
  requestError,
  sendCodeValidator,
  disabled,
}) => {
  const [loading, setLoading] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [time, setTime] = useState(0);
  const clickSendCode = useCallback(async () => {
    console.log({ disabled });
    if (loading || disabled) {
      return;
    }
    if (sendCodeValidator) {
      await sendCodeValidator();
    }
    setLoading(true);
    onClick?.();
    api?.()
      ?.then(res => {
        requestSuccess?.();
        setIsSend(true);
        setTime(60);
      })
      ?.catch(err => {
        requestError?.(err);
      })
      ?.finally(() => {
        setLoading(false);
      });
  }, [time, disabled]);

  React.useEffect(() => {
    if (time > 0) {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
  }, [time]);

  if (time <= 0) {
    return (
      <div
        className={classNames({
          [styles.sendCodeButton]: true,
          [styles.isLoading]: loading,
          [styles.disabled]: disabled,
        })}
        onClick={clickSendCode}>
        {loading ? '' : isSend ? 'Resend' : 'Send code'}
        {loading ? <IconLoading></IconLoading> : <></>}
      </div>
    );
  } else {
    return <div className={styles.countDown}>{time}s</div>;
  }
};

type SendCodeInputType = {
  api?: () => Promise<any>;
  onChange?: (val: string) => void;
  placeholder: string;
  label: string;
  field: string;
  required?: boolean;
  validator?: any;
  requestSuccess?: any;
  requestError?: any;
  sendCodeValidator?: () => Promise<any>;
  disabledSendCode?: boolean;
  errorMessage?: ErrorMessageType;
};

const SendCodeInput: React.FC<PropsWithChildren<SendCodeInputType>> = ({
  api,
  onChange,
  placeholder,
  label,
  field,
  required,
  validator,
  children,
  requestSuccess,
  requestError,
  sendCodeValidator,
  disabledSendCode,
  errorMessage,
}) => {
  const [code, setCode] = React.useState('');
  return (
    <>
      <ProForm.Item
        label={label}
        field={field}
        required={required}
        rules={[
          {
            validator(val, cb) {
              if (errorMessage?.field === field) {
                return cb(errorMessage?.content);
              }

              if (required && !val) {
                return cb(
                  `Please enter your ${label.toLocaleLowerCase()} to continue the process.`,
                );
              }

              if (validator) {
                return cb(validator(val));
              }

              return cb();
            },
          },
        ]}>
        <Input
          placeholder={placeholder}
          suffix={
            <>
              {code ? <div className={styles.sendCodeSplit}></div> : <></>}
              <SendCodeButton
                requestError={requestError}
                sendCodeValidator={sendCodeValidator}
                api={api}
                requestSuccess={() => {
                  requestSuccess?.();
                }}
                disabled={disabledSendCode}
              />
            </>
          }
          onChange={val => {
            setCode(val);
            onChange?.(val);
          }}
          allowClear
          className={styles.inputContainer}
        />
      </ProForm.Item>
      {children}
    </>
  );
};

export default SendCodeInput;
