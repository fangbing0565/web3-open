import React from 'react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import type { ColumnProps } from '@arco-design/web-react/es/Table/interface';
import { Link } from '@arco-design/web-react';
import LarkProfileTrigger, {
  PROFILE_LANG,
} from '@m4b-design/pearl-people-display';
import { Message, Popconfirm } from '@i18n-ecom/ui';
import { Link as RouterLink } from 'react-router-dom';
import { PAGE_PATH_LIST } from '@/constants/page-components';
import { BizTypeItem, getBizTypeName } from '@/utils/fetch-biz-type';
import { pageTypeFun } from '../constants';
import { OnLinePage } from './OnLinePage';

const onLineClick = (id: string, formRef: FormInstance) => {
  OnLinePage(id, formRef);
};

const pageComponentsColumns = ({
  formRef,
  pageTab,
  email,
  bizTypeList,
}: {
  formRef: FormInstance;
  pageTab: number;
  email?: string;
  bizTypeList: BizTypeItem[];
}) => {
  const owner = email?.split('@')?.[0] || '';
  const columns: ColumnProps[] = [
    {
      title: 'Page ID',
      dataIndex: 'id',
    },
    {
      title: 'Page Name',
      dataIndex: 'name',
    },
    {
      title: 'Page Key',
      dataIndex: 'page_code',
    },
    {
      title: 'Page Type',
      dataIndex: 'page_type',
      render: col => pageTypeFun(col),
    },
    {
      title: 'Biz Type',
      dataIndex: 'biz_type',
      render: col => getBizTypeName(col, bizTypeList),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      render: (col, record, index) => {
        return record.owner
          ? // <LarkProfileTrigger
            //   targetEmail={`${record.owner}@bytedance.com`}
            //   trigger="hover"
            //   lang={PROFILE_LANG.EN}>
            `${record.owner}`
          : // </LarkProfileTrigger>
            '-';
      },
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      render: (col, record, index) =>
        owner === record.owner ? (
          <div>
            <RouterLink
              to={PAGE_PATH_LIST.pageComponentEditPath + record.id}
              className="no-underline text-brand font-semibold"
              style={{ marginRight: 10 }}>
              Edit
            </RouterLink>
            {pageTab === 2 ? (
              <Popconfirm
                title="Are you sure you want to Online?"
                onOk={() => onLineClick(record?.id, formRef)}
                onCancel={() => {
                  Message.info({ content: 'cancel' });
                }}>
                <Link title="Online">Online</Link>
              </Popconfirm>
            ) : (
              ''
            )}
            <RouterLink
              className="no-underline text-brand font-semibold"
              to={PAGE_PATH_LIST.pageComponentPreviewPath + record.id}>
              View
            </RouterLink>
          </div>
        ) : (
          ' - '
        ),
    },
  ];
  return columns;
};

export default pageComponentsColumns;
