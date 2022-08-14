import React from 'react';
import styles from './index.scss';
import logoImage from '@/assets/logo.png';
import Dropdown from '@m4b-design/dropdown';
import { IconDown } from '@arco-design/web-react/icon';
import M4bMenu from '../m4b-menu';
import Button from '@m4b-design/button';
import { Link } from '@jupiter/plugin-runtime/router';
import { ACCOUNT_PATH_LIST } from '../../constants/paths';

const LoginNavBar: React.FC = () => {
  const languageList = ['English', 'Indonesian'];
  const [currentLang, setCurrentLang] = React.useState(languageList[0]);

  return (
    <div className={styles.LoginNavBarWarpper}>
      <div className={styles.loginNavbar}>
        <img
          src={logoImage}
          alt="Tik Top Shop Partner Center"
          className={styles.logo}
        />
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
          <Link to={ACCOUNT_PATH_LIST.ACCOUNT_LOGIN}>
            <Button type="primary">Log in</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginNavBar;
