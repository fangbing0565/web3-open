import { cloneDeep } from 'lodash';
import { Domain, event, ListenerFn, eventNS } from './interface';
import { GLOBAL_DOMIN } from './constants';

/**
 * 获取业务域
 */
function getDomain(domain?: Domain): Domain {
  return domain || window.__ContextValue__.__GlobalDomin__ || GLOBAL_DOMIN;
}

/**
 * 设置业务域
 */
function setDomain(domain: Domain) {
  window.__ContextValue__.__GlobalDomin__ = domain;
}

function getDiffValue(value: any, preValue: any): [boolean, any] {
  if (!preValue) {
    return [true, preValue]
  }
  if (value === preValue) {
    return [false, value];
  }
  const changeKeys: string[] = [];
  const prevGlobalState: any = cloneDeep(preValue);
  const newState: any = cloneDeep(
    Object.keys(value).reduce((_curState, changeKey) => {
      if (_curState.hasOwnProperty(changeKey)) {
        changeKeys.push(changeKey);
        return Object.assign(_curState, { [changeKey]: value[changeKey] });
      }
      return _curState;
    }, prevGlobalState),
  );
  if (changeKeys.length === 0) {
    return [false, value];
  }
  return [true, newState];
}

function checkWindow() {
  if (!window?.Garfish?.channel) {
    throw new Error('Please make sure Garfish version!');
  }
  if (!getGlobalContext()) {
    throw new Error('Sub app does not support separate reference！');
  }
}

function _on(event: event | eventNS, listener: ListenerFn) {
  window?.Garfish?.channel?.on(event, listener);
}

function _emit(event: event | eventNS, values: any) {
  window?.Garfish?.channel?.emit(event, values);
}

function _off(event: event | eventNS, listener: ListenerFn) {
  window?.Garfish?.channel?.removeListener(event, listener);
}

function getGlobalContext() {
  const nativeWindow = window?.Garfish?.getGlobalObject();
  return nativeWindow?.__ContextValue__;
}
function getGlobalObject(key: string) {
  const nativeWindow = window?.Garfish?.getGlobalObject();
  return nativeWindow?.__ContextValue__[key]
}

function setGlobalObject(key: string, value?: any) {
  const nativeWindow = window?.Garfish?.getGlobalObject();
  const contextValue = nativeWindow?.__ContextValue__;
  contextValue[key] = value;
  window?.Garfish?.setGlobalObject('__ContextValue__', contextValue);
}

export { checkWindow, setDomain, getDomain, _on, _emit, _off, getGlobalObject, setGlobalObject };
