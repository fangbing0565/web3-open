import React, { FC } from 'react';
import cx from 'classnames';
import styles from './index.scss';
import { useHistory } from '@jupiter/plugin-runtime/router';
import { Menu } from '@/hooks/useMenu/types';
import { useMenuContext } from '@/hooks/useMenu';

interface MenuLeafProps extends Menu {
  groupName: string;
}
const MenuLeaf: FC<MenuLeafProps> = ({
  groupName,
  defaultDisplayName: itemName,
  path,
  isVisible = true,
  targetBlank,
  targetBlankOecRegion,
}: MenuLeafProps) => {
  const history = useHistory();
  const { currentMenuInfo, setCurrentMenuInfo } = useMenuContext();
  const onClick = () => {
    if (path) {
      // track event: Pearl page click
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
    setCurrentMenuInfo?.(info => ({ ...info, groupName, itemName }));
  };

  return (
    <>
      {isVisible && (
        <li
          key={itemName}
          className={cx(styles.menuItem, {
            [styles.menuItemActive]:
              currentMenuInfo.groupName === groupName &&
              currentMenuInfo.itemName === itemName,
          })}
          onClick={onClick}>
          {itemName}
        </li>
      )}
    </>
  );
};
export default MenuLeaf;
