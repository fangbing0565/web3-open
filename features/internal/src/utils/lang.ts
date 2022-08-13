// @ts-nocheck
import { isFunction as isfunction, omitBy, isNil } from 'lodash-es';

/**
 * 检测类型
 */
const { toString } = Object.prototype;

const is = type => obj => toString.call(obj) === `[object ${type}]`;

export const isNull = n => n === null;

export const isRegExp = is('RegExp');

export const isString = is('String');

// 判断async函数 生成器函数有误
export const isFunction = isfunction;

export const isObject = is('Object');

export const isArray = is('Array');

export const isNumber = is('Number');

export const isDate = is('Date');

const typeBoolean = is('Boolean');

export const isFormData = is('FormData');

export const isError = is('Error');

export const isBlob = is('Blob');

export const isBoolean = (str) => {
  return typeBoolean(str) || str === 'true' || str === 'false';
};

export const isDigital = n => /^\d+$/.test(n);

export const isDefined = n => typeof n !== 'undefined';

export const isDef = n => !isNil(n) && n !== '';

export const isUndefined = n => n === void 0; // eslint-disable-line

export const isPromise = (obj) => {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
};

export const hasOwnProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

export const removeProperty = (object, properties) => Object.keys(object)
  .filter(key => !properties.includes(key))
  .reduce((result, key) => ({ ...result, [key]: object[key] }), {});

export const removeEmptyProperty = (object) => {
  const properties = Object.keys(object)
    .filter(key => object[key] == null || object[key] === ''); // null,undefined,''
  return removeProperty(object, properties);
};

export function convert2Map(list, uniqueName = 'id', uniqueValue?: string) {
  if (!isArray(list)) list = [list];

  return list.reduce((result, current) => {
    const key = isFunction(uniqueName) ? uniqueName(current) : current[uniqueName];
    if (isNil(key)) {
      logger.warn('convert2Map: can not find correct key: ', key, current);
    }

    return {
      ...result,
      [key]: uniqueValue ? current[uniqueValue] : current,
    };
  }, {});
}

export function parseJSON(s, defaultValue?: any) {
  let value = defaultValue;

  try {
    value = JSON.parse(s);
  } catch (e) {
    logger.warn('parseJSON ERROR: ', s);
  }

  return value;
}

export function pickProps<T = {}>(source, propNames: string[]): T {
  const target = {} as T;
  propNames.forEach(prop => {
    if (prop in source) {
      target[prop] = source[prop];
    }
  });
  return target;
}

export function stringifyJSON(o) {
  return JSON.stringify(o);
}

export function parseDataJSON(data, inputProps) {
  const columns = inputProps.filter(ip => ['json', 'object', 'array'].includes(ip.type)).map(ip => ip.name);
  return columns.reduce((result, column) => {
    if (result[column]) {
      return {
        ...result,
        [column]: parseJSON(result[column]),
      };
    }

    return result;
  }, data);
}

export function emptyFunction() {
  logger.debug('[emptyFunction:executed]');
}

export function isStringifyEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function toFixed(num, precision = 2) {
  // 先扩大倍数，处理完然后去缩小
  const enlarge = Math.round(+(`${num}e${precision}`));
  return Number(`${enlarge}e${-precision}`).toFixed(precision);
}

export function returnValue(value) {
  return value;
}

export function exch(array, a, b) {
  if (!Array.isArray(array)) return [];
  const tmp = array[a];
  array[a] = array[b];
  array[b] = tmp;
  return array;
}
/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
export function normalizeMap(map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }));
}

/**
 * 构造一个length长度的数组, 内容为索引
 * @param {*} length
 */
export function structuralArray(length) {
  return Array.from(Array(length)).map((_, i) => i);
}

/**
 * 遍历每一个属性 清除null 或者 undefined。和没有内容的字符串
 */
export function omitEmptyParams<T extends object>(params: T): Partial<T> {
  return omitBy(params, value => isNil(value) || !`${value}`.trim());
}

/* eslint-disable */
export function decare() {
  //笛卡尔积
  var twodDscartes = function (a, b) {
      var ret = [];
      for (var i = 0; i < a.length; i++) {
          for (var j = 0; j < b.length; j++) {
              ret.push(ft(a[i], b[j]));
          }
      }
      return ret;
  }
  var ft = function (a, b) {
      if (!(a instanceof Array))
          a = [a];
      var ret = a.slice(0);
      ret.push(b);
      return ret;
  }
  //多个一起做笛卡尔积
  return (function (data) {
      var len = data.length;
      if (len == 0)
          return [];
      else if (len == 1)
          return data[0];
      else {
          var r = data[0];
          for (var i = 1; i < len; i++) {
              r = twodDscartes(r, data[i]);
          }
          return r;
      }
  })(arguments.length > 1 ? arguments : arguments[0]);
}

// export function getUUID() {
//   return Math.random().toString(32).slice(2);
// }

export function notEmptyArray(array: Array<any>): boolean {
  // if (Array.isArray(array)) throw Error('Argument is not array');
  return Array.isArray(array) && !!array.length;
}
