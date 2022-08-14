import { useChannleState } from '../globalState';

export interface ConfigState {
  // 语言
  lang?: string;
  // i18n 设置
  i18n?: string;
}

/**
 * 获取全局config
 */
export const useConfig = (): [ConfigState, (value: ConfigState) => void] => {
  const [value, setValue] = useChannleState('globalConfig');
  return [value, setValue]
}

/**
 * 获取全局config
 * @param state 初始化数据
 * @param domin 业务域（可不写）
 * @returns
 */
export const useMainConfig = (state?: ConfigState, domin?: string): [ConfigState, (value: ConfigState) => void] => {
  const [value, setValue] = useChannleState('globalConfig', state, {
    domin
  });
  return [value, setValue]
}

