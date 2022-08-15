import React, { useState, useEffect } from 'react';
import PageTable from '@m4b-design/pearl-page-table';
import ProForm from '@m4b-design/pearl-pro-form';
import { IconPlus } from '@arco-design/web-react/icon';
import { SchemaFormOption } from '@m4b-design/pearl-schema-form';
import { Button } from '@i18n-ecom/ui';
import { NoDataComponent } from '@/components/no-data';
import AddModal from '../add-modal';
import { getCountry, getCategory, getSellerMarket } from '../fetcher';
import { columns } from './utils/columns';
import { getOptions } from './utils/options';
import { getList } from './utils/getList';
import styles from './index.scss';

const ManagementList: React.FC = () => {
  const [formRef] = ProForm.useForm();
  const [addVisible, setAddVisible] = useState(false);
  const [currOptions, setCurrOptions] = useState<SchemaFormOption[]>([]);
  const [getSelectAll, setGetSelectAll] = useState<Array<any>>([]);

  const handleAdd = () => {
    setAddVisible(true);
  };

  const onCancel = () => {
    setAddVisible(false);
    formRef.resetFields();
  };

  const getSearch = async () => {
    await Promise.all([getCountry(), getCategory(), getSellerMarket()])
      .then(res => {
        setCurrOptions(getOptions(res ?? []));
        setGetSelectAll(res ?? []);
      })
      .catch(err => {});
  };

  useEffect(() => {
    getSearch();
  }, []);

  return (
    <>
      <div className={styles.addBtnWrap}>
        <Button type="primary" onClick={handleAdd}>
          <IconPlus />
          &nbsp;{'Add market'}
        </Button>
      </div>

      <PageTable
        form={{
          form: formRef,
          options: currOptions,
          buttonProps: {
            hideSearch: true,
          },
        }}
        table={{
          columns: columns(formRef),
          rowKey: record => record?.service_area_rule.id,
          pagination: {
            defaultPageSize: 50,
          },
          noDataElement: <NoDataComponent />,
        }}
        fetcher={async (query: Record<string, any>) => getList(query)}
      />
      <AddModal
        visible={addVisible}
        onCancel={onCancel}
        listForm={formRef}
        currOptions={getSelectAll}
      />
    </>
  );
};
export default ManagementList;
