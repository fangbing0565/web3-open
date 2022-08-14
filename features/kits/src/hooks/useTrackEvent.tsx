import React, { useCallback } from 'react';
import { useLocation } from 'react-router';
import useAppConfig from './useAppConfig';
// import useCommonParam from './useCommonParam';
import useContextUser from './useContextUser';
import { envs } from '../utils';

export type TrackEventConfig = {
  customEventParams?: EventParams;
};
type EventParams = Record<string, string | number | undefined>;

const IS_BOE = !envs.isProd();
const useTrackEvent = (config: TrackEventConfig = {}) => {
  const Tea = window.Tea;
  const { customEventParams = {} } = config;
  const [user] = useContextUser();
  const { user_id: userID = '', user_name: userName = '' } =
    user?.userInfo ?? {};
  // TODO const [commonParam] = useCommonParam();
  const commonParam = { oec_region: '', oec_timezone: '' };
  const { oec_region: region = '', oec_timezone: timezone = '' } = commonParam;
  const { loading: appLoading, path } = useAppConfig();
  const { pathname } = useLocation();
  const defaultEventParams: EventParams = {
    EVENT_ORIGIN_FEATURE: 'TEMAI',
    channel_type: 'pc',
    page_name: path || pathname,
    page_type: 'page', // default page type
    user_id: userID,
    user_name: userName,
    region,
    timezone,
    ...customEventParams,
  };

  const trackEvent = useCallback(
    (eventName: string, eventParams: EventParams = {}) => {
      const finalEventParams = {
        ...defaultEventParams,
        ...eventParams,
      };
      const isReady = !appLoading && user?.isLogin;
      if (isReady) {
        if (IS_BOE) {
          console.log(`Track Event: ${eventName}`, finalEventParams);
        } else {
          Tea(eventName, finalEventParams);
        }
      }
    },
    [user, region, timezone, path],
  );

  return { trackEvent };
};

export default useTrackEvent;
