import { CategoryPropertyValue } from '@/api/operation/data/category_rule';
import { OPTable } from '@i18n-ecom-op/components';
import React, { FC, useState } from 'react';
import getColumns from './table-config';

const INIT_PAGESIZE = 10;
const INIT_CURRENT = 1;

const AttributeInfo: FC<{ value?: CategoryPropertyValue[] }> = ({ value }) => {
  const [pageSize, setPageSize] = useState(INIT_PAGESIZE);
  const [current, setCurrent] = useState(INIT_CURRENT);
  const data = value?.slice((current - 1) * pageSize, current * pageSize);
  return (
    <div>
      <OPTable
        style={{ marginTop: '20px' }}
        scroll={{ x: true }}
        type="default"
        rowKey="property_value_id"
        columns={getColumns()}
        data={data}
        pagination={{
          pageSize,
          total: value?.length,
          onChange: (pageNumber: number, pageSize: number) => {
            setCurrent(pageNumber);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
};

export default AttributeInfo;
