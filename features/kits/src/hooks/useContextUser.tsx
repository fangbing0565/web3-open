import createStateContext from './createStateContext';

export enum RoleType {
  NORMAL = 0,
  SPECIAL = 1,
}

export type RoleKey =
  | 'basic_operator'
  | 'category_operator'
  | 'config_operator'
  | 'logistics_operator'
  | 'govern_operator'
  | 'customer_serv'
  | 'senior_customer_serv'
  | 'finance'
  | 'cyberstar_operator'
  | 'biz_sens_info_view'
  | 'user_sens_info_view'
  | 'AM_operator';

/** RoleInfo used to for permission request page */
export interface AuthRoleInfo {
  key: RoleKey;
  display_name: string;
  description: string;
  role_type?: RoleType;
  applying_link?: string;
}

export interface UserInfo {
  user_id: string;
  avatar?: string;
  user_name?: string;
  email?: string;
  full_name?: string;
  name?: string;
}

export interface UserType {
  isLogin: boolean;
  userInfo?: UserInfo;
  roles: AuthRoleInfo[];
}

export const unLoginUserType: UserType = {
  isLogin: false,
  roles: [],
};

const [useContextUser, UserContextProvider] = createStateContext<UserType>(
  unLoginUserType,
);

export default useContextUser;

export { UserContextProvider };
