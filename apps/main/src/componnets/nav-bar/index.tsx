import React, { FC, useState, useEffect } from 'react';
import Menu from './top-menu';
import Dropdown from '@m4b-design/dropdown';
import { IconDown } from '@arco-design/web-react/icon';

import styles from './index.scss';
import { useHistory, Link } from '@jupiter/plugin-runtime/router';
import M4bMenu from '../m4b-menu';
import defaultAvatar from '@/assets/imgs/default-avatar.png';
import { getAccountInfo, logoutApi } from '@/account-api/profile';
import { Button } from '@m4b-design/components';
import { ACCOUNT_LOGIN, USER_ACTIONS } from '../../constants/vars';

const NavBar: FC = () => {
  const history = useHistory();
  const logoOnClick = () => {
    history.push('/');
  };
  const [visible, setVisible] = useState(false);
  // const languageList = ['English', 'Indonesian'];
  const userActions = [USER_ACTIONS.LOGOUT];
  // const [currentLang, setCurrentLang] = React.useState(languageList[0]);
  const [loading, setLoading] = React.useState(false);
  const [uInfo, setUInfo] = React.useState<any>();

  const handleUserAction = React.useCallback(key => {
    switch (key) {
      case USER_ACTIONS.LOGOUT:
        logoutApi();
        break;
      default:
        break;
    }
  }, []);

  const getAccountInfoFn = React.useCallback(() => {
    getAccountInfo()
      .then(res => {
        console.log({ res });
        setUInfo(res);
      })
      .catch(() => {})
      .finally(() => {});
  }, []);

  useEffect(getAccountInfoFn, []);

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={`${styles.logo}`} onClick={logoOnClick} />
        <Menu />
        <div className={styles.menu}>
          {/* <Dropdown
            droplist={
              <M4bMenu
                menuList={languageList}
                onClickMenuItem={key => setCurrentLang(key)}
                activeKey={currentLang}></M4bMenu>
            }
            trigger="click">
            <div className={styles.dropdown}>
              {currentLang} <IconDown />
            </div>
          </Dropdown>
          <div className={styles.line}></div> */}
          {!loading || uInfo ? (
            <Dropdown
              droplist={
                <M4bMenu
                  menuList={userActions}
                  onClickMenuItem={key => handleUserAction(key)}
                />
              }
              trigger="click">
              <div className={styles.dropdown}>
                <img
                  src={defaultAvatar}
                  alt="avatar"
                  className={styles.avatar}
                />
                <div className={styles.username}>{uInfo?.email || ''}</div>
                <IconDown />
              </div>
            </Dropdown>
          ) : (
            <Link to={ACCOUNT_LOGIN}>
              <Button type="primary">Log in</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
