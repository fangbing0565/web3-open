import React from 'react';
import { Button } from '@i18n-ecom/ui';
import { IconPlus } from '@arco-design/web-react/icon';
import styles from './index.scss';

const ComponentMiddle = ({
  total,
  middleText,
  handleCreate,
  btnText = 'Create',
}: {
  total: number;
  middleText: string;
  handleCreate: () => void;
  btnText?: string;
}) => {
  return (
    <div className={styles.componentMiddleWrap}>
      <div className={styles.tableTotal}>
        <span>{total}</span> {middleText}
      </div>
      <Button type="primary" onClick={handleCreate}>
        <IconPlus />
        &nbsp;{btnText}
      </Button>
    </div>
  );
};

export default ComponentMiddle;
