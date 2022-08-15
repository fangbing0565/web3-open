import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { RouterPageTable, useData } from '@i18n-ecom-op/block-page-table';
import { useCommonParam } from '@i18n-ecom-op/hooks';
import { useKaniPermission } from '@i18n-ecom-op/api-hooks';
import { Button, Form, Modal, Input, Message } from '@i18n-ecom/ui';

import { Paths } from '@/constants/fe-category';
import BasicDescription, {
  DataType,
} from '@i18n-ecom-op/components/selection-components/basic-description';
import {
  FeAuditStatus,
  FePublishStatus,
  FeAction,
  FeCategoryTreeVersion,
} from '@/api/operation/data/category_rule';
import { useParams } from 'react-router-dom';
import { categoryRuleAPIClient } from '@/api/operation/serv/oec_operation_category_rule_api';
import Middle from '../components/middle';
import { GetCategoryTreeVersion } from '../fetchers';
import BasicCommon from '../components/basic-common';
import { DEFAULT_PAGE_SIZE, getFormOptions, getTableColumns } from './config';
import styles from './index.scss';

interface IParam {
  tree_id: string;
}

const TreeVersionPage = () => {
  const [formRef] = Form.useForm();
  const [{ oec_region }] = useCommonParam();
  const { validate } = useKaniPermission();
  const isActionPermission = validate('action_fe_category_tree');
  const history = useHistory();
  const { tree_id } = useParams<IParam>();
  const FormItem = Form.Item;
  const { visible, show, hide } = Modal.useModal();
  const [form] = Form.useForm();
  const { mutate } = useData();

  return (
    <div>
      <BasicCommon />
      <div className={styles.treeVersionPage}>
        <RouterPageTable
          form={{
            formRef,
            options: getFormOptions(),
            formLayoutStyle: { paddingLeft: '8px' },
            btnListClassName: 'pl-8',
          }}
          Middle={
            <Modal
              title="Add New Front-end Category Tree Version"
              visible={visible}
              onCancel={() => {
                hide();
                form.resetFields();
              }}
              closable={true}
              onOk={async () => {
                await form.validate();
                try {
                  const version_name = form.getFieldValue('version_name');
                  const result = await categoryRuleAPIClient.CreateNewVersionCategoryTree(
                    {
                      tree_id,
                      version_name,
                    },
                  );
                  const { message } = result;
                  hide();
                  Message.success(message);
                  await mutate();
                } catch (error) {
                  Message.error(error.message);
                }
              }}>
              <Form form={form} layout={'vertical'}>
                <FormItem
                  label="Front-end Category Tree Version Name"
                  field="version_name"
                  rules={[{ required: true }]}>
                  <Input placeholder="Enter Front-end Category Tree Version Name" />
                </FormItem>
              </Form>
            </Modal>
          }
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
              GetCategoryTreeVersion(oec_region, { ...query, tree_id }),
          }}
        />
        <Button
          type="primary"
          className={styles.createButton}
          disabled={!isActionPermission}
          onClick={() => {
            show();
          }}>
          Update Version
        </Button>
      </div>
    </div>
  );
};

export default TreeVersionPage;
