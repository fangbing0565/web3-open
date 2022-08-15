import React from 'react';
import { NodeProps } from '@arco-design/web-react/es/Tree/interface';
import { Text } from '@i18n-ecom-op/components';
import styles from './index.scss';

export const TreeItemTitle: React.FC<NodeProps> = props => {
  const { title } = props;

  return (
    <div className={styles.treeTitle}>
      <Text content={title} />
    </div>
  );
};
