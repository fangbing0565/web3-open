import { useChannleState } from '../globalState';

export interface UserInfoState {
  // 头像信息
  avatar_url?: string;
  // 用户昵称
  user_name?: string;
  // 用户ID
  user_id?: string;
  // 用户邮箱
  email?: string;
  // 用户手机号
  mobile?: string;
  // 其他参数
  // [key: string]: any;
}

/**
 * 用户信息
 * @return [UserInfoState, (value: UserInfoState) => void]
 */
export const useUserInfo = (): [UserInfoState, (value: UserInfoState) => void] => {
  const [value, setValue] = useChannleState('userInfo');
  return [value, setValue]
}

/**
 * 用户信息
 * @params state 默认值 UserInfoState
 * @params domin 业务域 string
 * @return [UserInfoState, (value: UserInfoState) => void]
 */
 export const useMainUserInfo = (state?: UserInfoState, domin?: string): [UserInfoState, (value: UserInfoState) => void] => {
  const [value, setValue] = useChannleState('userInfo', state, {
    domin
  });
  return [value, setValue]
}
