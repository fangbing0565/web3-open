import React from 'react';
import styles from './index.scss';
import classnames from 'classnames';

const M4bMenu = ({ onClickMenuItem, menuList, activeKey }) => (
  <div className={styles.menuWrapper}>
    {menuList.map(menuItem => (
      <div
        key={menuItem}
        onClick={() => {
          onClickMenuItem(menuItem);
        }}
        className={classnames({
          [styles.menuItem]: true,
          [styles.activeMenu]: menuItem === activeKey,
        })}>
        {menuItem}
      </div>
    ))}
  </div>
);

export default M4bMenu;
