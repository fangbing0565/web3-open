import React, { useState } from 'react';
import NavBar from './components/nav-bar';
import classnames from 'classnames';
import styles from './assets/styles/index.scss';
import SideMenu from './components/side-menu';
import { Routes } from './routes';
import { ModuleInfo } from '@jupiter/plugin-garfish';
export interface LayoutProps {
  apps: Array<ModuleInfo>;
}

function Layout(props: LayoutProps) {
  const { apps } = props;
  const [navbarVisible, setNavbarVisible] = useState<any>(false);
  const [sidebarVisible, setSidebarVisible] = useState<any>(false);
  const handleRouteChange = res => {
    console.log('info', res);

    res.navbar && res.navbar === true
      ? setNavbarVisible(true)
      : setNavbarVisible(false);
    res.sidebar && res.sidebar === true
      ? setSidebarVisible(true)
      : setSidebarVisible(false);
  };

  return (
    <>
      {navbarVisible && <NavBar />}
      <div
        className={classnames({
          [styles.content]: true,
          [styles.hideNavBar]: !navbarVisible,
        })}>
        {sidebarVisible && <SideMenu />}
        <div
          className={classnames({
            [styles.contentMain]: true,
            [styles.hideMenu]: !sidebarVisible,
            [styles.contentMainNoNav]: !navbarVisible,
          })}>
          <Routes apps={apps} handleRouteChange={handleRouteChange} />
        </div>
      </div>
    </>
  );
}

export default Layout;
