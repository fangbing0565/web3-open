import React, {
    FC,
    createContext,
    useContext,
    useState,
    useEffect,
  } from 'react';
  // import { MApp } from '@jupiter-app/plugin-garr';
  import { useLocation, useParams } from 'react-router';
  const getPageConfig = () => ({
    title: '',
    path: '',
    breadcrumbs: [],
    layoutConfig: '',
  });
  type AppConfigContextValue = {
    // mApps?: MApp[];
    mApps?: any[];
    currentApp?: any;
    breadcrumbs?: any[];
    // breadcrumbs?: BreadcrumbDataItem[];
    // todo: getPageConfig中title和path默认值都为空串，类型声明是否可以改为必选
    title?: string;
    path?: string;
    // layoutConfig?: LayoutConfig;
    layoutConfig?: any;
    setNewTitle?: (title?: string) => void;
    loading: boolean;
  };
  const defaultValue: AppConfigContextValue = {
    mApps: [],
    loading: true,
  };
  const context = createContext<AppConfigContextValue>(defaultValue);
  type AppConfigProviderProps = {
    mApps?: any[];
  };
  const AppConfigProvider: FC<AppConfigProviderProps> = ({ mApps, children }) => {
    const { pathname } = useLocation();
    const params = useParams();
    const [newTitle, setNewTitle] = useState<string>();
    // TODO: confirm if can use app.path instead of `/${app.name}`.
    const currentApp = mApps?.find(
      pathname === '/'
        ? app => app.name === 'home'
        : app => pathname.startsWith(`/${app.name}`),
    );
    const loading = !currentApp?.provider;
    const { title, path, breadcrumbs, layoutConfig } = getPageConfig();
    useEffect(() => {
      setNewTitle(title);
    }, [title]);
    const handleSetNewTitle = (title?: string) => {
      setNewTitle(title || '');
    };
    // Because not update state, so can not run in useEffect.
  
    return (
      <context.Provider
        value={{
          mApps,
          currentApp,
          title: newTitle,
          breadcrumbs,
          layoutConfig,
          setNewTitle: handleSetNewTitle,
          path,
          loading,
        }}
      >
        {children}
      </context.Provider>
    );
  };
  const useApp = () => useContext(context);
  export default useApp;
  export { AppConfigProvider };
  