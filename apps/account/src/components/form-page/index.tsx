import React, { FC, PropsWithChildren, ReactNode, useMemo } from 'react';
import styles from './index.scss';
import defaultImage from '@/assets/default.png';
import { IconLeft } from '@arco-design/web-react/icon';
import { useLocation, Link } from '@jupiter/plugin-runtime/router';
import { matchRoutes } from '@oec-open/ttspc-kits';

type FormPageType = {
  title: string | ReactNode;
  pic?: string;
  titleChildren?: ReactNode;
  backName?: string;
  backPath?: string;
};

const FormPageTitle = ({ title, titleChildren, backName, backPath }) => {
  if (title || titleChildren) {
    return (
      <div className={styles.formPageTitleWrapper}>
        <div>
          {title ? (
            <>
              {backName ? (
                <Link to={backPath} className={styles.nameWrapper}>
                  <IconLeft />
                  {backName}
                </Link>
              ) : (
                <></>
              )}
              <div className={styles.formPageTitle}>{title}</div>
            </>
          ) : (
            <></>
          )}
        </div>
        {titleChildren}
      </div>
    );
  }
  return <></>;
};

const FormPage: FC<PropsWithChildren<FormPageType>> = ({
  title,
  titleChildren,
  pic = defaultImage,
  children,
  backName,
  backPath,
}) => {
  return (
    <div className={styles.formPage}>
      <FormPageTitle
        title={title}
        titleChildren={titleChildren}
        backName={backName}
        backPath={backPath}
      />
      <div className={styles.formPageContent}>
        <div className={styles.formPagePic}>
          <img src={pic} alt="picture" className={styles.defaultPic} />
        </div>
        <div className={styles.formPageChildren}>{children}</div>
      </div>
    </div>
  );
};

export default FormPage;
