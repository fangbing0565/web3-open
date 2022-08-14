import { BasePlugin, Level } from '@ecom/lib_types';

export interface CounterParams {
  name: string;
  value?: number;
  tags: Record<string, any>;
}

export interface ApiCounterParams {
  api_url: string;
  code: string;
  result: string;
  page_path: string;
  http_status: string;
  test_account?: string;
}

export type SlardarEventOptions = {
  /** 自定义事件名称 */
  name: string;
  /** metrics 上报的是可以被度量的值，也就是数值 */
  metrics?: { [key: string]: number };
  /** categories 上报的是分类，维度，用来做筛选，分组 */
  categories?: { [key: string]: string };
};

export interface LogParams {
  value?: string;
  tags?: Record<string, any>;
  content?: string;
  level?: Level;
  extra?: { [key: string]: string | number };
}

export interface ApiLogParams {
  api_url: string;
  api_code: string;
  log_id?: string;
  http_status: string;
  content?: string;
  extra_log?: Record<string, any>;
  level?: Level;
  log_type?: string;
  test_account?: string;
}

export declare type SlardarConfig = {
  bid?: string;
  release?: string;
  env?: string;
  userId?: string | number;
  plugins?: Record<string, any>;
  beforeSend?: (event: any) => void;
  customModules?: (new () => BasePlugin)[];
};
