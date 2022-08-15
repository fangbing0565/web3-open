import React from 'react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { ColumnProps } from '@arco-design/web-react/es/Table/interface';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@arco-design/web-react';
import { BIZ_PATH_LIST } from '@/constants/biz-components';
import { Message, Popconfirm } from '@i18n-ecom/ui';
import DateDisplay from '@m4b-design/date-display';
import { BizTypeItem, getBizTypeName } from '@/utils/fetch-biz-type';
import { removeBiz } from './removeBiz';

const onRemoveClick = (id: string, formRef: FormInstance) => {
  removeBiz(id, formRef);
};

export const bizComponentsColumns = (bizTypeList: BizTypeItem[]) => {
  const columns: ColumnProps[] = [
    {
      title: 'BizComponents ID',
      dataIndex: 'id',
    },
    {
      title: 'BizComponents Name',
      dataIndex: 'name',
    },
    {
      title: 'Biz Type',
      dataIndex: 'biz_type',
      render: col => getBizTypeName(col, bizTypeList),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
    },
    {
      title: 'Create Time',
      render: (_, record) => {
        return <DateDisplay timeStamp={record?.create_time / 1000 / 1000} />;
      },
    },
    {
      title: 'Update Time',
      render: (_, record) => {
        return <DateDisplay timeStamp={record?.update_time / 1000 / 1000} />;
      },
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      render: (col, record, index) => (
        <div>
          <RouterLink
            className="no-underline text-brand font-semibold"
            style={{ marginRight: 10 }}
            to={BIZ_PATH_LIST.bizComponentEditPath + record.id}>
            Edit
          </RouterLink>
          {/* <Popconfirm
            title="Are you sure you want to Remove?"
            onOk={() => onRemoveClick(record?.id, formRef)}
            onCancel={() => {
              Message.info({ content: 'cancel' });
            }}>
            <Link title="Remove">Remove</Link>
          </Popconfirm> */}

          <RouterLink
            className="no-underline text-brand font-semibold"
            to={BIZ_PATH_LIST.bizComponentPreviewPath + record.id}>
            View
          </RouterLink>
        </div>
      ),
    },
  ];
  return columns;
};
