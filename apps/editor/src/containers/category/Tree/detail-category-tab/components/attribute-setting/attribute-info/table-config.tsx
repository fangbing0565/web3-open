import React from 'react';
import { OPColummProps } from '@i18n-ecom-op/components/op-table/interface';

const getColumns = () => {
  const columns: OPColummProps[] = [
    {
      title: 'No',
      dataIndex: 'no',
      width: 100,
      render: (col, item, index: number) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: 'Attribute Value ID',
      dataIndex: 'property_value_id',
    },
    {
      title: 'Attribute Value',
      dataIndex: 'property_value_name',
    },
  ];
  return columns;
};

export default getColumns;
