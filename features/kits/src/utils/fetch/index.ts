// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-statements */
import _fetch, {
    ReqConfig,
    ContentType,
    HttpMethod,
  } from '@i18n-ecom/lib/dist/commonjs/fetch';
  import QueryString from 'qs';
  import {
    HttpCode,
    HttpMessage,
    HttpStatusCode,
    BIZ_MODE,
    APP_ID,
  } from '../../constants';
  import {
    reportSlardarApiLogs,
    reportSlardarApiCounter,
  } from '../slardar-monitor';
  import { ApiCounterParams, ApiLogParams } from '../slardar-monitor/type';
  import { OptionConfig } from './types';
  import { handleErrorCode } from './utils';
  // import { doApplyAuth, handleErrorCode } from './utils';
  
  // maintain a mapping from ferry to i18nFetch
  const contentTypeMap: Record<string, ContentType> = {
    'application/x-www-form-urlencoded': ContentType.UrlEncoded,
    'application/json': ContentType.JSON,
    'multipart/form-data': ContentType.FormData,
  };
  const sendTags = (value: any, result: string) => {
    const emitMessage: ApiCounterParams = {
      result,
      api_url: value?.url,
      code: String(value?.code),
      page_path: location.pathname,
      http_status: String(value?.httpStatus || value?.status_code),
    };
    reportSlardarApiCounter(emitMessage);
  };
  const sendError = (err: any) => {
    const emitLog: ApiLogParams = {
      content: 'api error',
      api_url: err?.url,
      api_code: String(err?.code),
      http_status: String(err?.httpStatus),
      log_id: err?.logId,
      extra_log: { ...err },
      level: 'error',
      log_type: 'error_log',
    };
    reportSlardarApiLogs(emitLog);
  };
  
  const fetchVerify = (res: any) => {
    if (
      res.message === HttpMessage[0] ||
      res.status_code === HttpCode.Success ||
      res.code === HttpCode.Success
    ) {
      return false;
    }
    return true;
  };
  // PEARL_APP_ID
  const getGlobalParams = (appId?: number) => {
    const { biz_mode = BIZ_MODE.L2L, oec_region } = QueryString.parse(
      location.search.slice(1),
    );
    return { biz_mode, oec_region, aid: appId };
  };
  
  export interface FetchConfigProps {
    appId: number;
  }
  
  function Fetch(envConfig: FetchConfigProps) {
    const { appId } = envConfig;
    // 先传入环境变量
    return async (uri: string, init?: RequestInit, option?: OptionConfig) => {
      const globalParams = getGlobalParams(appId);
      const commonParams = {
        ...globalParams,
        ...option?.commonParams,
      };
      const { useCommonErrorHandler = true } = option ?? {};
      const reqConfig: ReqConfig = {
        method: init?.method ? (init?.method as HttpMethod) : HttpMethod.get,
        commonParams,
        contentType:
          contentTypeMap[
            (init?.headers as Record<string, string>)?.['Content-Type']
          ],
        data: init?.body,
        verify: option?.verify || fetchVerify,
        timeout: option?.timeout,
        isRawRes: option?.isRawRes,
      };
  
      try {
        const res: any = await _fetch(uri, reqConfig);
        if (
          res.status_code === HttpCode.Success ||
          res.message === HttpMessage[0]
        ) {
          res.code = 0;
        }
        if (res.code === HttpCode.Success) {
          sendTags(res, 'success');
          return res;
        } else {
          sendTags(res, 'fail');
          sendError(res);
          if (useCommonErrorHandler) {
            const newRes = handleErrorCode(res);
            return await Promise.reject(newRes);
          } else {
            return await Promise.reject(res);
          }
        }
      } catch (error: any) {
        sendTags(error, 'http_err');
        sendError(error);
        //   const statusCode = error?.httpStatus;
        //   const applying_link = error?.data?.permission_info?.applying_link;
        //   if (statusCode) {
        //     if (statusCode === HttpStatusCode.Unauthorized) {
        //       doLogin(option?.ssoLoginQuery);
        //     } else if (statusCode === HttpStatusCode.Forbidden) {
        //       // like the data_seller_personal_info permission does not bind any role, need to apply by kain link.
        //       doApplyAuth({
        //         applyingLink: applying_link,
        //         unbindRolePermission: option?.unbindRolePermission,
        //       });
        //     }
        //     // TODO: 404, 50x, tosat the match error
        //   }
        // const newError = new Error(JSON.stringify(error));
        // newError.name = `Fetch Error ${statusCode}`;
        return Promise.reject(error);
      }
    };
  }
  const fetch = Fetch({ appId: APP_ID });
  export default fetch;
  