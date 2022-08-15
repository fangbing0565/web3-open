import React, { useState } from 'react';
import PageTable from '@m4b-design/pearl-page-table';
import ProForm from '@m4b-design/pearl-pro-form';
import ComponentMiddle from '@/components/component-middle';
import { BIZ_PATH, BIZ_PATH_LIST } from '@/constants/biz-components';
import { useHistory } from '@jupiter/plugin-runtime/router';
import { useBizType } from '@/utils/fetch-biz-type';
import { bizComponentsColumns } from './utils/bizComponentsColumns';
import { getOptions } from './utils/options';
import { getBizList } from './utils/getBizList';
import styles from './index.scss';
import CreateBizComponents from './components/create-biz-components';

const BizComponentsList: React.FC = () => {
  const [formRef] = ProForm.useForm();
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const [bizTypeList] = useBizType();

  const handleReset = () => {
    formRef.resetFields();
    formRef.submit();
  };
  return (
    <div className={styles.wrapper}>
      <CreateBizComponents
        onCancel={() => setVisible(false)}
        visible={visible}
        submitSuccess={res => {
          setVisible(false);
          const { group_id } = res;
          history.push(BIZ_PATH_LIST.bizComponentEditPath + group_id);
        }}
      />
      <PageTable
        form={{
          form: formRef,
          options: getOptions(bizTypeList),
          onReset: handleReset,
          buttonProps: {
            list: [
              {
                type: 'submit',
                text: 'Search',
                styleType: 'primary',
              },
              {
                type: 'reset',
                text: 'Reset',
              },
            ],
          },
        }}
        Middle={({ searchResult }) => (
          <ComponentMiddle
            total={searchResult.total}
            middleText={'Templates'}
            handleCreate={() => setVisible(true)}
          />
        )}
        table={{
          columns: bizComponentsColumns(bizTypeList),
          rowKey: 'id',
          pagination: {
            defaultPageSize: 10,
          },
        }}
        fetcher={(query: Record<string, any>) => getBizList(query)}
      />
    </div>
  );
};
export default BizComponentsList;
