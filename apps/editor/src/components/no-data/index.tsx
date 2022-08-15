import React from 'react';
import illustration from './illustration.png';
import styles from './index.scss';

export const NoDataComponent = (props: { text?: string }) => {
  const { text = 'No result' } = props;
  return (
    <div className={styles.container}>
      <img src={illustration} className={styles.img} />
      <span className={styles.text}>{text}</span>
    </div>
  );
};
