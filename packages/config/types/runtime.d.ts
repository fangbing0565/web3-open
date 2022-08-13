// @ts-ignore
declare type Compiler = import('webpack').Compiler;
// @ts-ignore
declare type Compilation = import('webpack').compilation.Compilation;
// @ts-ignore
declare type TeaConfig = import('@jupiter-app/plugin-tea/dist/typings').Config;
// @ts-ignore
declare type StarlingConfig = import('@jupiter-app/plugin-i18n/dist/typings').Config;

declare type IdcConfig = {
  idc_name: string;
  tea_host: string;
  cdn_assets_host: string;
  starling_host: string;
};

export declare type AppConfig = {
  idc: IdcConfig;
  app_name: string;
  region_name: string;
  app_id: number;
  tea: TeaConfig;
  starling: StarlingConfig;
  snippets: string[];
  tt_oauth: {
    client_key: string;
    platform_app_id: string;
  };
  account_subject_app_id: number;
};
