import { Link } from 'react-router-dom';
import { Paths } from '@/constants/fe-category';
import { useCommonParam } from '@i18n-ecom-op/hooks';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import {
  EasyFormOption,
  FORM_ITEM_TYPE,
  renderFormatTime,
} from '@i18n-ecom-op/components';

import React from 'react';
import { DefaultRegion } from '@/constants/constant';

import { categoryRuleAPIClient } from '@/api/operation/serv/oec_operation_category_rule_api';

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
      label: 'Front-end Category Tree Name',
      type: FORM_ITEM_TYPE.INPUT,
      field: 'tree_name',
      placeholder: 'Enter Front-end Category Tree Name',
      customOptions: {
        allowClear: true,
      },
      colSpan: DefaultColSpan,
    },
    {
      label: 'Front-end Category Tree ID',
      type: FORM_ITEM_TYPE.INPUT,
      placeholder: 'Enter Front-end Category Tree ID',
      field: 'tree_id',
      customOptions: {
        allowClear: true,
      },
      colSpan: DefaultColSpan,
    },
    {
      label: 'Creator Name',
      type: FORM_ITEM_TYPE.INPUT,
      placeholder: 'Enter Creator Name',
      customOptions: {
        allowClear: true,
      },
      field: 'creator_name',
      colSpan: DefaultColSpan,
    },
    {
      label: 'Create Time',
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
): ColumnProps[] => [
  {
    title: 'Front-end Category Tree Name',
    dataIndex: 'name',
    width: 247,
    render: (_, record) => record.name,
  },
  {
    title: 'Front-end Category Tree ID',
    dataIndex: 'tree_id',
    width: 247,
    render: (_, record) => record.tree_id,
  },
  {
    title: 'Creator Name',
    dataIndex: 'creator',
    width: 247,
    render: (_, record) => record.creator,
  },
  {
    title: 'Create Time',
    dataIndex: 'create_time',
    width: 247,
    render: (_, record) => {
      return renderFormatTime(record.create_time);
    },
  },
  {
    title: 'Action',
    width: 247,
    render: (_, record) => {
      return (
        <>
          {
            <Link
              className="no-underline text-brand font-semibold"
              to={`/partner/fe-category/version/${record.tree_id}/`}>
              View Version
            </Link>
          }
        </>
      );
    },
  },
];
