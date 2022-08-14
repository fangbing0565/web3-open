import React, {
    createContext,
    FC,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from 'react';
  import { getCurrentMenu, getMenus } from './utils';
  import { useLocation } from '@jupiter/plugin-runtime/router';
  import { useRequest } from '@byted/hooks';
  import { Menu } from './types';
  
  const defaultMenuInfo = {
    path: '',
    groupName: '',
    itemName: '',
  };
  
  export type CurrentMenuInfo = typeof defaultMenuInfo & {
    curMenu?: Menu;
  };
  interface IMenuContext {
    currentMenuInfo: CurrentMenuInfo;
    setCurrentMenuInfo?: React.Dispatch<React.SetStateAction<CurrentMenuInfo>>;
    loading: boolean;
    menus?: Menu[];
    regions?: string[];
    getPathWithCommonParams?: (path: string) => string;
  }
  const defaultValues = {
    currentMenuInfo: defaultMenuInfo,
    loading: true,
  };
  const MenuContext = createContext<IMenuContext>(defaultValues);
  const useMenuContext = () => {
    return useContext(MenuContext);
  };
  
  const MenuProvider: FC = ({ children, ...rest }) => {
    const { data } = useRequest<{ menu: Menu[] } | undefined, []>(getMenus, {
      initData: undefined,
      auto: true,
    });
  
    const reactLocation = useLocation();
  
    const [currentMenuInfo, setCurrentMenuInfo] =
      useState<CurrentMenuInfo>(defaultMenuInfo);
  
    useEffect(() => {
      if (data?.menu) {
        const currentMenu = getCurrentMenu(location.pathname, data?.menu);
        console.log(9999, currentMenu);
        setCurrentMenuInfo(currentMenu);
      }
    }, [data?.menu, location, reactLocation]);
  
    return (
      <MenuContext.Provider
        value={{
          ...defaultValues,
          currentMenuInfo,
          setCurrentMenuInfo,
          menus: data?.menu,
          ...rest,
        }}>
        {children}
      </MenuContext.Provider>
    );
  };
  export { useMenuContext };
  export default MenuProvider;
  