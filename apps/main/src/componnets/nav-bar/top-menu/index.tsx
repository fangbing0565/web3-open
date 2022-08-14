import React, { FC, useEffect, useState } from 'react';
import { usePortal } from '@byted/hooks';
import cx from 'classnames';
import styles from './index.scss';
import { useHistory } from '@jupiter/plugin-runtime/router';
import { Menu, MenuItem } from '@/hooks/useMenu/types';
import { useMenuContext } from '@/hooks/useMenu';

const HONE_PAGE_TEXT = 'Home';
const TOGGLE_INTERNAL = 300;

const getFirstLeafPath = (menu: Menu): string => {
  const { path, children } = menu;
  if (path && path !== '') {
    return path;
  }
  const targetChild = children
    ?.filter(item => item.isVisible !== false)
    ?.find(item => {
      const filterChild = item.children?.filter(
        item => item.isVisible || !item.hasOwnProperty('isVisible'),
      );
      // return !filterChild?.every(leaf => leaf.targetBlank);
      return filterChild;
    });

  if (targetChild) {
    return getFirstLeafPath(targetChild);
  }
  return '';
};

const depMenu = (menus?: MenuItem[]): MenuItem[] => {
  return (
    menus?.map(item => ({
      ...item,
      children: depMenu(item.children),
    })) || []
  );
};

const MenuComponent: FC = () => {
  const { menus, currentMenuInfo, setCurrentMenuInfo } = useMenuContext();
  const [filterMenu, setFilterMenu] = useState<MenuItem[]>([]);
  const [domainName, setDomainName] = useState('');
  const [onMenu, setOnMenu] = useState(false);
  const [onSubmenu, setOnSubmenu] = useState(false);
  const history = useHistory();
  const { Portal, open, close } = usePortal();
  const delayClose = React.useRef<any>();

  useEffect(() => {
    if (onMenu || onSubmenu) {
      clearTimeout(delayClose.current);
      open();
    } else {
      delayClose.current = setTimeout(function () {
        close();
      }, TOGGLE_INTERNAL);
    }
  }, [onMenu, onSubmenu]);

  const goHome = () => {
    history.push('/');
  };

  const { children: currentGroup = [] } =
    menus?.find(menu => menu.defaultDisplayName === domainName) || {};

  useEffect(() => {
    setFilterMenu(depMenu(menus));
  }, [menus]);

  return (
    <>
      <ul className={styles.menu}>
        {/* <li
          key="index"
          onClick={goHome}
          className={cx({
            [styles.menuItemActive]: currentMenuInfo.domainName === '',
          })}>
          {HONE_PAGE_TEXT}
        </li>
        {filterMenu
          ?.filter(topMenu => topMenu.children?.length !== 0)
          ?.map(topMenu => {
            const { defaultDisplayName, path, targetBlank } = topMenu;
            const onMouseOver = () => {
              setDomainName(defaultDisplayName);
              if (!targetBlank) {
                setOnMenu(true);
              }
            };
            const firstLeafPath = getFirstLeafPath(topMenu);
            const onClick = () => {
              if (
                targetBlank ||
                path?.startsWith('http://') ||
                path?.startsWith('https://')
              ) {
                window.open(path);
                return;
              }
              firstLeafPath && history.push(firstLeafPath);
            };
            return (
              <li
                onClick={onClick}
                onMouseOver={onMouseOver}
                onMouseLeave={() => setOnMenu(false)}
                key={defaultDisplayName}
                className={cx({
                  [styles.menuItemActive]:
                    currentMenuInfo.domainName === defaultDisplayName,
                })}>
                {defaultDisplayName}
              </li>
            );
          })} */}
      </ul>
      {/* <Portal>
        <div
          className={styles.submenu}
          onMouseOver={() => setOnSubmenu(true)}
          onMouseLeave={() => setOnSubmenu(false)}>
          {currentGroup
            ?.filter(menuGroup => menuGroup?.children?.length)
            .map(menuGroup => {
              const { defaultDisplayName: groupName, children } = menuGroup;
              return (
                <div key={groupName} className={styles.submenuItem}>
                  <h3>{groupName}</h3>
                  {children && (
                    <ul>
                      {children.map(item => {
                        const {
                          defaultDisplayName: itemName,
                          path,
                          isVisible = true,
                          targetBlank,
                          targetBlankOecRegion,
                        } = item;
                        const onClick = () => {
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
                          setCurrentMenuInfo?.({
                            domainName,
                            groupName,
                            itemName,
                          });
                        };
                        return (
                          isVisible && (
                            <li
                              key={itemName}
                              onClick={onClick}
                              data-title={itemName}>
                              {itemName}
                            </li>
                          )
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
        </div>
      </Portal> */}
    </>
  );
};

export default MenuComponent;
