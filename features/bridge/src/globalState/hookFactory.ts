import { useState, useEffect } from 'react';
import {
  getDomain,
  _on,
  _emit,
  _off,
} from './utils';
import { GLOBAL_EVENT_EMITTER } from './constants';

/**
 * window初始化设置
 */
if (!window.__ContextValue__) {
  window.__ContextValue__ = {}
}

export interface ChannleOptions {
  domin?: string;
  disabled?: boolean;
}

export const useChannleState = (
  key: string,
  value?: any,
  options?: ChannleOptions,
) => {
  const { domin } = options || {};
  const _domin = getDomain(domin);
  const dominKey = `${_domin}_${key}`;
  const eventKey = `${GLOBAL_EVENT_EMITTER}:${_domin}:${key}`;

  if (!window.__ContextValue__.hasOwnProperty(dominKey)) {
    window.__ContextValue__[dominKey] = value
  }
  const [initValue, setInitValue] = useState<any>(value || window.__ContextValue__[dominKey]);

  const setValue = (_value: any) => {
    _emit(eventKey, _value);
  };

  const handleEvent = (_value: any) => {
    setInitValue(_value);
    window.__ContextValue__[dominKey] = _value;
  };

  useEffect(() => {
    _on(eventKey, handleEvent);
    if (value) {
      setValue(value);
    }
    return () => {
      _off(eventKey, handleEvent);
    };
  }, []);

  return [initValue, setValue];
};
