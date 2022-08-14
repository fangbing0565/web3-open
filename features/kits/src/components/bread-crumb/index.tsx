import React, { useMemo } from 'react';
import { Link, useLocation } from '@jupiter/plugin-runtime/router';
import { IconLeft } from '@arco-design/web-react/icon';
import styles from '../../styles/components/breadCrumb.scss';
import { matchRoutes } from '../../utils';

const Breadcrumb = (props: any) => {
  const { routers } = props;
  const reactLocation = useLocation();
  const branch = useMemo(() => {
    return routers ? matchRoutes(routers, location.pathname, []) : null;
  }, [routers, location, reactLocation]);

  if (!branch) {
    return null;
  }

  const title = branch[branch.length - 1]?.route.name;

  return (
    <div
      className={`${styles.breadCrumbContainer} mt-8 mt-16 flex flex-col justify-between items-start`}>
      {branch.length >= 3 && (
        <div className={styles.backContainer}>
          <IconLeft />
          <Link to={branch[branch.length - 2]?.route.path}>
            {branch[branch.length - 2]?.route.name}
          </Link>
        </div>
      )}
      {title && <h1>{title}</h1>}
    </div>
  );
};

export default Breadcrumb;
