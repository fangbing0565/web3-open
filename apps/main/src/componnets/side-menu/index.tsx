import React, { useState, useEffect } from 'react';
import { usePortal } from '@byted/hooks';
import styles from './index.scss';
import MenuGroup from './menu-group';
import { useMenuContext } from '@/hooks/useMenu';
import { MenuItem as MenuItem1 } from '@/hooks/useMenu/types';
import Toolkit from './toolkit';

import { Menu } from '@arco-design/web-react';
import {
  IconApps,
  IconBug,
  IconBulb,
  IconHome,
} from '@arco-design/web-react/icon';
import { useHistory } from 'react-router';
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function SideMenu() {
  const { Portal } = usePortal({ default: true });

  const {
    menus,
    currentMenuInfo: { path, itemName, groupName },
    setCurrentMenuInfo,
  } = useMenuContext();

  const [selectedKey, setSelectedKey] = useState<any>(path ? path : '0');
  const [selectedOpenKey, setSelectedOpenKey] = useState<any>(
    groupName ? groupName : '0',
  );

  useEffect(() => {
    if (!itemName && !groupName) {
      setSelectedKey('0');
    } else {
      setSelectedOpenKey(groupName.trim());
      setSelectedKey(path.trim());
    }
  }, [path, itemName, groupName]);

  const history = useHistory();
  const handleMenuItemClick = (MenuItem: MenuItem1 | string) => {
    if (typeof MenuItem === 'string') {
      history.push(MenuItem);
    } else {
      const {
        defaultDisplayName: itemName,
        path,
        isVisible = true,
        targetBlank,
        targetBlankOecRegion,
      } = MenuItem;
      if (path) {
        if (
          targetBlank ||
          path.startsWith('http://') ||
          path.startsWith('https://')
        ) {
          const finalPath = targetBlankOecRegion
            ? `${path}?oec_region=${targetBlankOecRegion}`
            : path;
          window.open(finalPath);
          return;
        }
        history.push(path);
      }
    }
    setCurrentMenuInfo?.({
      path: path ? path : '',
      groupName,
      itemName,
    });
  };

  return (
    <Portal>
      <div className={styles.menuContainer}>
        <Menu
          selectedKeys={selectedKey ? selectedKey : '0'}
          openKeys={[selectedOpenKey ? selectedOpenKey : '0']}
          onClickMenuItem={(key: string, event, keyPath: string[]) => {
            setSelectedKey(key);
            if (key === '0') setSelectedOpenKey(null);
            console.log(1111, key, event, keyPath);
          }}
          onClickSubMenu={(
            key: string,
            openKeys: string[],
            keyPath: string[],
          ) => {
            setSelectedOpenKey(key);
            console.log(11112, key, openKeys, keyPath);
          }}
          // onCollapseChange={(collapse: boolean) => {
          //   console.log(11113, collapse);
          // }}
        >
          <MenuItem key="0" onClick={() => handleMenuItemClick('/')}>
            <IconHome />
            Home
          </MenuItem>
          {menus?.map(subMenu => {
            return (
              <SubMenu
                key={subMenu.defaultDisplayName}
                title={
                  <>
                    <IconApps />
                    {subMenu.defaultDisplayName}
                  </>
                }>
                {subMenu.children?.map(menuItem => {
                  return (
                    <MenuItem
                      key={menuItem.path?.trim() ?? ''}
                      onClick={() => handleMenuItemClick(menuItem)}>
                      {menuItem.defaultDisplayName}
                    </MenuItem>
                  );
                })}
              </SubMenu>
            );
          })}
        </Menu>
        <Toolkit />
      </div>
    </Portal>
  );
}

export default SideMenu;
