import React, { useState } from 'react';
import { TableAction } from '@i18n-ecom-op/components';
import { TableActionItem } from '@i18n-ecom-op/components/table-action';
import { Modal, Message } from '@i18n-ecom/ui';
import { RootDispatch, RootState } from '@/store';
import { useSelector, useDispatch } from 'react-redux';
import {
  UpdateCategoryRuleValueRequest,
  categoryRuleAPIClient,
} from '@/api/operation/serv/oec_operation_category_rule_api';
import { useKaniPermission } from '@i18n-ecom-op/api-hooks';
import RuleValueSelect from './rule-value-select';

interface RuleListActionProps {
  ruleId: string;
  dimension: string;
  category_id: string;
  ruleValueId: string;
}

const RuleListAction = (props: RuleListActionProps) => {
  const { ruleId, ruleValueId, category_id, dimension } = props;
  const region = dimension?.split('-')?.[0];
  const saleType = Number(dimension?.split('-')?.[1]);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<string>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  // const [rolePermission] = useRolePermission('govern_operator');
  const { validate } = useKaniPermission();
  const rolePermission = validate('action_product_category_governance');
  const {
    categoryTree: { setNeedUpdate },
  } = useDispatch<RootDispatch>();
  const { needUpdate } = useSelector((state: RootState) => state.categoryTree);

  const handleEdit = () => {
    setVisible(true);
  };

  const actions: Array<TableActionItem> = [
    {
      text: 'Edit',
      onClick: handleEdit,
      visiable: rolePermission,
    },
  ];

  const handleSubmit = async () => {
    if (!value) {
      return;
    }
    const request: UpdateCategoryRuleValueRequest = {
      category_id,
      region,
      sale_type: saleType,
      rule_id: ruleId,
      rule_value_id: value,
    };
    try {
      setConfirmLoading(true);
      const {
        code,
        message,
      } = await categoryRuleAPIClient.UpdateCategoryRuleValue(request);
      if (code === 0) {
        Message.success('Category rule value updated successfully');
        setVisible(false);
      } else {
        Message.error(message || 'Something wrong, please retry');
      }
      setNeedUpdate(needUpdate + 1);
    } catch (error) {
      const { message } = error;
      Message.error(message || 'Something wrong, please retry');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleSelect = (value: string) => {
    setValue(value);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <TableAction actions={actions} displayNumber={4} />
      <Modal
        title="Edit Rule Value"
        visible={visible}
        autoFocus={false}
        focusLock={true}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        onOk={handleSubmit}>
        <RuleValueSelect
          ruleId={ruleId}
          selectedValue={ruleValueId}
          onSelect={handleSelect}
        />
      </Modal>
    </>
  );
};

export default RuleListAction;
