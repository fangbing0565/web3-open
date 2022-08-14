// import { ColumnProps } from '@arco-design/web-react/es/Table/interface';
// import { EasyFormOption } from '@i18n-ecom-op/components';
// import { REGION_LIST } from '@i18n-ecom-op/constants';
// import { Provider } from '@i18n-ecom-op/constants/app-config';
// import { Tea as TeaType } from '@jupiter-app/plugin-tea/dist/teaType';
// import { BreadCrumbConfig } from '../bread-crumb';

export {};
declare global {
  interface Window {
    // APP_BUILD_INFO: Record<string, BuildInfoType>;
    // Feelgood: any;
    // gfdatav1?: {
    //   garrModules?: {
    //     data?: { name: string; source_url: string; version: string }[];
    //     menu?: MenuItem[];
    //     env?: Record<string, string>;
    //   };
    //   [key: string]: any;
    // };
    // // tea 事件上报函数
    // // https://bytedance.feishu.cn/docs/doccnTfGUAmzvQ8EXptVVEFSryi#
    Tea: any;
    // Tea: TeaType;
    // collectEvent(method: string, config: any): void;
    // slardar错误上报，初始化在jupiter.config.js构建时完成
    // https://slardar.bytedance.net/docs/115/150/3471/
    Slardar: (type: string, c?: any, v?: any) => void;
  }
  // const MAIN_HOST: {
  //   VA: string;
  //   ID: string;
  //   UK: string;
  //   GB: string;
  // };
  // const IS_FANS: boolean;
  const IS_BOE: boolean;
  // const IS_PROD: boolean;
  // const IMAGEX_DOMAIN: string;
  // const APPROVAL_DOMAIN: string;
  // const IMAGEX_SVG_TEMPLATE: string;
  // const IMAGEX_SERVICE_ID: string;
  // const DOMAIN: string;
  const PEARL_APP_ID: string;
  // const APP_ID: {
  //   TT: number;
  // };
  // const SLARDAR_BID: string;
  // const BUILD_TYPE: string;
  // const POPUP_CONTAINER_ID: string;
  // type ComponentWithBreadCrumb<C = {}> = C & {
  //   breadCrumbConfig?: BreadCrumbConfig;
  // };
  // type Application<P = {}> = React.FC<P> & Provider;
  // const TOS_CDN_PREFIX: string;
  // const LOCATION_PREFIX: string;
  // type ExcelSheet = {
  //   name: string;
  //   data: any[][];
  // };
  // type CustomColumnsProps<T> = ColumnProps & {
  //   dataIndex?: keyof T;
  //   render?: (col: any, item: T, index: number) => any;
  // };
  // type CustomEasyFormOption<T> = EasyFormOption & {
  //   field?: keyof T;
  // };
  // type BaseResponse<T> = {
  //   data: T;
  //   message: string;
  //   code: number;
  // };
  // interface BuildInfoType {
  //   build_base_commit_hash: string;
  //   build_branch: string;
  //   build_pub_date: string;
  //   build_version: string;
  //   app_name: string;
  // }
  // const BUILD_INFO: BuildInfoType;
  // interface MenuItem {
  //   starlingKey?: string;
  //   defaultDisplayName: string;
  //   children?: MenuItem[];
  //   path?: string;
  //   iconType?: string;
  //   enable: boolean;
  //   order: number;
  //   isVisible?: boolean;
  //   isTest?: boolean;
  //   permission?: {
  //     regions?: string[];
  //   };
  //   targetBlank?: boolean;
  //   autoExpand?: boolean;
  //   targetBlankOecRegion?: REGION_LIST;
  // }
  interface RegionType {
    asci_name?: string;
    center?: any[];
    code: string;
    geoname_id?: number;
    name?: string;
    properties?: {
      centroid?: any[];
      country_code: string;
      dial_code: string;
      flag_circle_url: string;
      flag_rectangle_url: string;
      flag_url: string;
      official_language: string;
      official_language_code: string;
      time_zone: string;
      timezone_dst_offset: string;
      timezone_name: string;
      timezone_offset: string;
    }
  }
}
