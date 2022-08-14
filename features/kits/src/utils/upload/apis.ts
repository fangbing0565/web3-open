// @ts-nocheck
import ferryFetch from '../fetch';

export function queryStringify(params, inBody?: any) {
  const items = [];

  function itemStringify(obj, prefix) {
    const type = Object.prototype.toString.call(obj);
    if (type === '[object Array]') {
      obj.forEach((item, key) => {
        itemStringify(item, `${prefix}[${key}]`);
      });
    } else if (type === '[object Object]') {
      for (const key in obj) {
        itemStringify(obj[key], `${prefix}[${key}]`);
      }
    } else if (type === '[object Date]') {
      items.push(`${prefix}=${obj.toISOString()}`);
    } else if (type === '[object Null]') {
      items.push(`${prefix}=`);
    } else if (type !== '[object Undefined]') {
      items.push(`${prefix}=${encodeURIComponent(obj)}`);
    }
  }

  for (const k in params) {
    itemStringify(params[k], k);
  }

  const str = items.join('&');
  return str && !inBody ? `?${str}` : str;
}

export const headers = { 'Content-Type': 'application/json' };
export const method = 'GET';
export const credentials = 'same-origin';

export function SaveFileInfo(request, option = {}) {
  const uri = `/api/v1/file/save`;
  const body = request;
  return ferryFetch(uri, { method: 'POST', headers, body }, option);
}

export function GetResourceUploadToken(request, option = {}) {
  const query = queryStringify(request);
  const uri = `/api/v1/file/resource/token${query}`;
  return ferryFetch(uri, { method, headers }, option);
}

export function GetResourceUrlFromUri(request, option = {}) {
  const query = queryStringify(request);
  const uri = `/api/v1/file/resource/url${query}`;
  return ferryFetch(uri, { method, headers }, option);
}
