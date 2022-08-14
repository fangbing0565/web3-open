import { Level } from '@ecom/lib_types';
import {
  CounterParams,
  ApiCounterParams,
  LogParams,
  ApiLogParams,
  SlardarConfig,
} from './type';

// 统一使用sendException, 上报js exception 异常
export function sendException(
  error: any,
  extra?: Record<string, string>,
): void {
  if (!window?.Slardar || process.env.NODE_ENV !== 'production') {
    return;
  }
  window?.Slardar?.('captureException', error, extra);
}

export function reportSlardarCounter(params: CounterParams) {
  const { name, value = 1, tags } = params;
  window?.Slardar?.('sendEvent', {
    name,
    metrics: {
      count: value,
    },
    categories: tags,
  });
}
// 自定义打点
export function reportSlardarApiCounter(params: ApiCounterParams) {
  reportSlardarCounter({
    name: 'api_monitor',
    tags: params,
  });
}

export function reportSlardarLogs(params: LogParams) {
  const { content, level, extra } = params;
  window?.Slardar?.('sendLog', {
    content,
    level,
    extra,
  });
}

export function reportSlardarApiLogs(params: ApiLogParams) {
  const {
    api_url,
    api_code,
    log_id = '',
    http_status,
    content = 'unknown error',
    extra_log = {},
    level = 'warn',
    log_type = 'all',
  } = params;
  reportSlardarLogs({
    content,
    level,
    extra: {
      api_url,
      api_code,
      log_id,
      http_status,
      log_type,
      extra_log: JSON.stringify(extra_log),
    },
  });
}

export const configSlardar = (config: SlardarConfig) => {
  window?.Slardar?.('init', config);
};

export const startSlardar = (config?: SlardarConfig) => {
  if (config) {
    configSlardar(config);
  }
  window?.Slardar?.('start');
};

export const sendLog = (
  level: Level,
  content: string,
  extra?: {
    [key: string]: string | number;
  },
) => {
  window?.Slardar?.('sendLog', {
    content,
    level,
    extra,
  });
};

export const sendEvent = (
  name: string,
  metrics?: {
    [key: string]: number;
  },
  categories?: {
    [key: string]: string;
  },
) => {
  window?.Slardar?.('sendEvent', {
    name,
    metrics,
    categories,
  });
};

export const reportReactError = (error: Error, componentStack?: string) => {
  window?.Slardar?.('reportReactError', {
    error,
    componentStack,
  });
};
