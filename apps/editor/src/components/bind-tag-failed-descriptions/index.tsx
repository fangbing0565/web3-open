import React from 'react';
import { MBindObjectsTagFailReason } from '@/api/product/serv/oec_product_operator_backend_api';
import { Descriptions } from '@i18n-ecom/ui';
import styled from './index.scss';

interface Props {
  reasons: MBindObjectsTagFailReason[];
}
export const BindTagFailedDescription = ({ reasons }: Props) => {
  return (
    <div className={styled['bind-tag-failed-descriptions']}>
      <Descriptions
        data={reasons.map(reason => ({
          label: reason.object_id,
          value: reason.reason,
        }))}
        column={1}
      />
    </div>
  );
};
