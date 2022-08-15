import React, { useEffect, useState } from 'react';
import PageTable from '@m4b-design/pearl-page-table';
import ProForm from '@m4b-design/pearl-pro-form';
import { NoDataComponent } from '@/components/no-data';
import { columns } from './utils/columns';
import { getOptions } from './utils/options';
import { getList } from './utils/getList';

const AccountTable = ({
  getSelected,
  getSelectedRowsKeys,
  selectedRowkeys,
  currOptions,
}: {
  getSelected: (getSelected: Array<any>) => void;
  getSelectedRowsKeys: (selectedRowsKeys: Array<string>) => void;
  selectedRowkeys: Array<string>;
  currOptions: any;
}) => {
  const [formRef] = ProForm.useForm();
  return (
    <>
      <PageTable
        form={{
          form: formRef,
          options: getOptions(currOptions),
          buttonProps: {
            hideSearch: true,
          },
        }}
        table={{
          columns: columns(),
          rowKey: record => record?.relation?.key,
          showHeader: false,
          pagination: true,
          rowSelection: {
            type: 'checkbox',
            fixed: true,
            selectedRowKeys: selectedRowkeys,
            onChange: (selectedRowsKeys: any, selectedRows: any) => {
              getSelected(selectedRows);
              getSelectedRowsKeys(selectedRowsKeys);
            },
            checkboxProps: record => {
              return {
                disabled: record?.relation?.page_code !== '',
              };
            },
          },
          noDataElement: <NoDataComponent />,
        }}
        fetcher={async (query: Record<string, any>) => getList(query)}
      />
    </>
  );
};

export default AccountTable;
