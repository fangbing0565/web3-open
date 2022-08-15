import React from 'react';
import { NodeProps } from '@arco-design/web-react/es/Tree/interface';
import {
  CategoryStatus,
  AuditStatus,
} from '@/api/operation/data/category_rule';
import StatusTag from '@/components/status-tag';
import styles from './index.scss';

export const TreeItemExtra: React.FC<NodeProps> = props => {
  const { category_status, audit_status } = (props as any).dataRef;
  return (
    <div className={styles.titleTail}>
      {category_status === CategoryStatus.CATEGORY_OFFLINE &&
      audit_status !== AuditStatus.Audit_QC_PENDING ? (
        <StatusTag text="Offline" color="Gray" />
      ) : null}
      {audit_status === AuditStatus.Audit_QC_PENDING ? (
        <StatusTag text="Pending" color="Orange" />
      ) : null}
    </div>
  );
};
