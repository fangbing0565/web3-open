import React from 'react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { ColumnProps } from '@arco-design/web-react/es/Table/interface';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@arco-design/web-react';
import { PAGE_PATH_LIST } from '@/constants/page-components';
import DateDisplay from '@m4b-design/date-display';
import PeopleDisplay, { PROFILE_LANG } from '@m4b-design/pearl-people-display';
import TableActions from '../components/table-actions';

export const columns = (formRef: FormInstance) => {
  const columns: ColumnProps[] = [
    {
      title: 'Open category & market',
      render: (_, record) => {
        const rule = record?.service_area_rule;
        return `${rule?.partner_country?.code} - ${rule?.category?.category_name} - ${rule?.seller_market.code}`;
      },
    },
    {
      title: 'Operator',
      render: (_, record) => {
        return (
          <PeopleDisplay
            targetEmail={`${record?.relation?.owner}@bytedance.com`}
            trigger="click"
            lang={PROFILE_LANG.ZH}>
            {record?.relation?.owner}
          </PeopleDisplay>
        );
      },
    },
    {
      title: 'Open time',
      render: (_, record) => {
        return (
          <DateDisplay
            timeStamp={record?.relation?.update_time / 1000 / 1000}
          />
        );
      },
    },
    {
      title: 'Connected Form',
      dataIndex: 'create_time',
      ellipsis: true,
      render: (_, record) => (
        <RouterLink
          className="no-underline text-brand font-semibold"
          to={
            PAGE_PATH_LIST.pageComponentPreviewPath + record?.relation?.page_id
          }>
          <Link title={record?.relation?.page_name}>
            {record?.relation?.page_name}
          </Link>
        </RouterLink>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      render: (_, record) => <TableActions record={record} form={formRef} />,
    },
  ];
  return columns;
};
