import React from 'react';
import { useData } from '@i18n-ecom-op/block-page-table';
import styles from './index.scss';

export default () => {
  const { data } = useData();
  const total = data?.total ?? 0;
  return (
    <div className={styles.middleBox}>
      <span className={styles.number}>{total}</span>
      <span>in total</span>
    </div>
  );
};
