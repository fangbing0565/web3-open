import React from 'react';
import { IconMore } from '@arco-design/web-react/icon';
import { Dropdown } from '@i18n-ecom/ui';
import { DropdownMenus as renderDropdownMenus } from './DropdownMenus';
import styles from './index.scss';

export const MoreDropdown = React.memo(() => {
  return (
    <Dropdown
      droplist={renderDropdownMenus()}
      position="br"
      triggerProps={{
        autoFixPosition: false,
      }}>
      <div className={styles.dropdownButton}>
        <IconMore className={styles.iconMore} />
      </div>
    </Dropdown>
  );
});
