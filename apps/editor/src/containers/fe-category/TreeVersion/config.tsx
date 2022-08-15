import { ColumnProps } from '@arco-design/web-react/es/Table';
import {
  EasyFormOption,
  FORM_ITEM_TYPE,
  renderFormatTime,
} from '@i18n-ecom-op/components';
import React from 'react';
import { DefaultRegion } from '@/constants/constant';
import { Tag } from '@i18n-ecom/ui';
import {
  FeCategoryTreeVersion,
  FeAuditStatus,
  FePublishStatus,
} from '@/api/operation/data/category_rule';

import VersionAction from '../components/version-action';

export const DEFAULT_PAGE_SIZE = 50;

export const DefaultColSpan: {
  span: number;
  style: {
    padding: string;
  };
} = {
  span: 6,
  style: {
    padding: '0 8px',
  },
};
export const getFormOptions = (): EasyFormOption[] => {
  return [
    {
      label: 'Version Name',
      type: FORM_ITEM_TYPE.INPUT,
      field: 'version_name',
      colSpan: DefaultColSpan,
      placeholder: 'Enter version Name',
      customOptions: {
        allowClear: true,
      },
    },
    {
      label: 'Updated Time',
      type: FORM_ITEM_TYPE.DATE_RANGE_PICKER_I18N,
      field: 'create_time',
      colSpan: DefaultColSpan,
      customOptions: {
        rangeForServer: true,
        allowClear: true,
      },
    },
  ];
};

export const getTableColumns = (
  region: string = DefaultRegion,
): ColumnProps[] => {
  return [
    {
      title: 'Version ID',
      dataIndex: 'version_id',
      width: 200,
    },
    {
      title: 'Version Name',
      dataIndex: 'version_name',
      width: 200,
    },
    {
      title: 'Post Status',
      width: 200,
      render: (_, record) => (
        <div>
          {(record.fe_publish_status ===
            FePublishStatus.FE_PUBLISH_STATUS_NON_ONLINE && (
            <Tag color="gray" className="font-bold">
              Non-online
            </Tag>
          )) ||
            (record.fe_publish_status ===
              FePublishStatus.FE_PUBLISH_STATUS_ONLINE && (
              <Tag color="green" className="font-bold">
                Active
              </Tag>
            )) ||
            (record.fe_publish_status ===
              FePublishStatus.FE_PUBLISH_STATUS_OFFLINE && (
              <Tag color="red" className="font-bold">
                Offline
              </Tag>
            ))}
        </div>
      ),
    },
    {
      title: 'Approval Status',
      width: 200,
      render: (_, record) => (
        <div>
          {(record.fe_audit_status ===
            FeAuditStatus.FE_AUDIT_STATUS_NON_AUDIT && (
            <Tag color="gray" className="font-bold">
              New
            </Tag>
          )) ||
            (record.fe_audit_status ===
              FeAuditStatus.FE_AUDIT_STATUS_AUDITING && (
              <Tag color="orange" className="font-bold">
                Pending Approval
              </Tag>
            )) ||
            (record.fe_audit_status ===
              FeAuditStatus.FE_AUDIT_STATUS_AUDIT_FAIL && (
              <Tag color="red" className="font-bold">
                Approval
              </Tag>
            )) ||
            (record.fe_audit_status ===
              FeAuditStatus.FE_AUDIT_STATUS_AUDIT_SUCCESS && (
              <Tag color="green" className="font-bold">
                Approval passed
              </Tag>
            ))}
        </div>
      ),
    },
    {
      title: 'Creator Name',
      dataIndex: 'creator',
      width: 200,
    },
    {
      title: 'Updated Time',
      dataIndex: 'update_time',
      width: 200,
      render: (_, record) => {
        return renderFormatTime(record.update_time);
      },
    },
    {
      title: 'Action',
      width: 200,
      render: (_, record: FeCategoryTreeVersion) => {
        return <VersionAction record={record} />;
      },
    },
  ];
};
