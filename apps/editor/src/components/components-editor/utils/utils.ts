import { Message } from '@arco-design/web-react';
import { getType } from './capture-error';

export const setObjKey = (
  obj: { [key: string]: any },
  key: string,
  data: any,
) => {
  const fieldChain = key?.split('.');
  let objCopy = obj;
  while (fieldChain?.length) {
    const fieldItem = fieldChain.shift();
    if (fieldItem) {
      const isArray = /(.*)\[(\d+)\]$/.test(fieldItem);
      const key = RegExp.$1;
      const index = RegExp.$2;
      if (!objCopy.hasOwnProperty(isArray ? key : fieldItem)) {
        if (isArray) {
          objCopy[key] = [];
        } else {
          objCopy[fieldItem] = {};
        }
      }
      if (!fieldChain.length) {
        if (isArray) {
          objCopy[key][index] = data;
        } else {
          objCopy[fieldItem] = data;
        }
      } else {
        if (isArray) {
          objCopy = objCopy[key][index];
        } else {
          objCopy = objCopy[fieldItem];
        }
      }
    }
  }
};

export const getObjKey = (obj: { [key: string]: any }, key: string) => {
  const fieldChain = key?.split('.');
  let objCopy = obj;
  while (fieldChain?.length) {
    const fieldItem = fieldChain.shift();
    if (fieldItem) {
      const isArray = /(.*)\[(\d+)\]$/.test(fieldItem);
      const key = RegExp.$1;
      const index = RegExp.$2;
      if (objCopy.hasOwnProperty(isArray ? key : fieldItem)) {
        if (!fieldChain.length) {
          if (isArray) {
            return objCopy[key][index];
          }
          return objCopy[fieldItem];
        } else {
          if (isArray) {
            objCopy = objCopy[key][index];
          } else {
            objCopy = objCopy[fieldItem];
          }
        }
      }
    }
  }
  return null;
};

export const onSetSafeValueFn = (val: string) => {
  if (/(document\.|window\.|eval)/.test(val)) {
    Message.error('No safe text!');
    return false;
  }
  return val;
};

export const validatorI18n = (pageI18n: boolean, val: any): boolean => {
  if (typeof val === 'string') {
    if (!pageI18n && /^\s*\$\./.test(val)) {
      Message.error('do not start with $.');
      return false;
    }
  } else if (getType(val) === 'Object') {
    Object.values(val).forEach(v => {
      return validatorI18n(pageI18n, v);
    });
  } else if (getType(val) === 'Array') {
    for (const v of val) {
      return validatorI18n(pageI18n, v);
    }
  }
  return true;
};
