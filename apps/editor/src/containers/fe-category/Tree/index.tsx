import React from 'react';

import { RouterPageTable } from '@i18n-ecom-op/block-page-table';
import { useCommonParam } from '@i18n-ecom-op/hooks';
import { Button, Form, Modal } from '@i18n-ecom/ui';
import { FeCategoryTreeData } from '@/api/operation/serv/oec_operation_category_rule_api';

import { ActionApplyImpl } from '@/components/action-apply';
import CreateModal from '../components/create-modal';
import { GetCategoryTree } from '../fetchers';
import { DEFAULT_PAGE_SIZE, getFormOptions, getTableColumns } from './config';
import styles from './index.scss';

const CategoryTreePage = () => {
  const [formRef] = Form.useForm();
  const [{ oec_region }] = useCommonParam();
  const { visible, show, hide } = Modal.useModal();

  return (
    <div className={styles.categoryTreePage}>
      <RouterPageTable<FeCategoryTreeData, {}>
        form={{
          formRef,
          options: getFormOptions(),
          formLayoutStyle: { padding: '0px 8px' },
          btnListClassName: 'pl-8',
        }}
        Middle={<CreateModal visible={visible} show={show} hide={hide} />}
        table={{
          columns: getTableColumns(oec_region),
          rowKey: 'id',
          pagination: {
            defaultPageSize: DEFAULT_PAGE_SIZE,
            className: 'pr-8',
          },
          className: 'pl-8 pr-8',
        }}
        swrConfig={{
          fetcher: (_: any, query: Record<string, any>) =>
            GetCategoryTree(oec_region, query),
        }}
      />
      <ActionApplyImpl
        component={Button}
        resourceKey={'action_fe_category_tree'}
        type="primary"
        className={styles.createButton}
        onClick={() => {
          show();
        }}>
        + Add New Tree
      </ActionApplyImpl>
    </div>
  );
};
export default CategoryTreePage;
