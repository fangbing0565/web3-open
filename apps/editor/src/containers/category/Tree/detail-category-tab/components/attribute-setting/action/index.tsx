import React, { FC } from 'react';
import TableAction, {
  TableActionItem,
} from '@i18n-ecom-op/components/table-action';
import { Modal } from '@i18n-ecom/ui';
import { CategoryProperty } from '@/api/operation/data/category_rule';
import AttributeInfo from '../attribute-info';

const Action: FC<{ properties?: CategoryProperty }> = ({ properties }) => {
  const openAttributeInfoModal = () => {
    Modal.info({
      style: { width: 550 },
      title: 'Attribute Value',
      content: <AttributeInfo value={properties?.values} />,
      closable: true,
      footer: null,
    });
  };

  const actions: TableActionItem[] = [
    {
      text: 'View',
      onClick: openAttributeInfoModal,
    },
  ];
  return <TableAction actions={actions} />;
};
export default Action;
