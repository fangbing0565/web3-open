declare const DEVELOP_ENV: 'LOCAL' | 'BOE' | 'ONLINE';
declare const IS_BOE: boolean;
declare const IS_ONLINE: boolean;
declare const IS_PROD: boolean;
declare const BUILD_INFO: BUILD_INFO_TYPE;

declare interface BUILD_INFO_TYPE {
  build_base_commit_hash: string;
  build_branch: string;
  build_pub_date: string;
  build_version: string;
  app_name: string;
}

/**
 * @deprecated DEPRECATED_APP_ID should not be used, use REGION_NAME for @features/runtime/config.
 */
declare const DEPRECATED_APP_ID: number;

/**
 * @deprecated REGION should not be used, use REGION_NAME for @features/runtime/config.
 */
declare const REGION: string;

interface Window {
  /** SCM Build Info for each app. */
  APP_BUILD_INFO: Record<string, BUILD_INFO_TYPE>;
  /** Runtime Config. */
  __TTSPC_APP_ENVS__: Omit<
    import('./runtime').AppConfig,
    'snippets'
  >;
  /** Runtime Config for Starling keys. */
  __SELLER_STARLING__: Record<string, Record<string, string>>;
  /** Google Analytics tracker. */
  gtag: (type: 'event', event: string) => void;
  /** TikTok Ads tracker. */
  ttq: {
    track: (event: string) => void;
  };
  /** Facebook tracker. */
  fbq: (type: 'track' | 'trackCustom', event: string) => void;
}
