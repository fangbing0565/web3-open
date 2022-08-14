import React, { FC } from 'react';
import apiDocs from '@/assets/imgs/toolkits/api_docs.png';
import batchTool from '@/assets/imgs/toolkits/batch_tool.png';
import moreIcon from '@/assets/imgs/toolkits/more.png';
import styles from './index.scss';

const Toolkit: FC = () => {
  return (
    <div>
      <div className={styles['toolkit-title']}>Toolkit</div>
      <div className={styles['toolkit-container']}>
        <div className={styles['toolkit-item']}>
          <img className={styles['toolkitItemIcon']} src={apiDocs} />
          <span className={styles['toolkitItemTitle']}>API Docs</span>
        </div>
        <div className={styles['toolkit-item']}>
          <img className={styles['toolkitItemIcon']} src={batchTool} />
          <span className={styles['toolkitItemTitle']}>Batch Tool</span>
        </div>
        <div className={styles['toolkit-item']}>
          <img className={styles['toolkitItemIcon']} src={moreIcon} />
          <span className={styles['toolkitItemTitle']}>More</span>
        </div>
      </div>
    </div>
  );
};
export default Toolkit;
