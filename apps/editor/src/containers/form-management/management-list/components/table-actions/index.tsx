import React from 'react';
import {
  partnerOpAPIClient,
  DeleteFormRelationReq,
  KeyType,
} from '@/api/operation/serv/oec_operation_partner_op_api';
import { Link as RouterLink } from 'react-router-dom';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { Link } from '@arco-design/web-react';
import { Modal, Message } from '@i18n-ecom/ui';
import { PAGE_PATH_LIST } from '@/constants/page-components';

const TableActions = ({
  record,
  form,
}: {
  record: any;
  form: FormInstance;
}) => {
  const { relation } = record;
  const handleDelete = () => {
    Modal.confirm({
      content: `Disconnect form and delete the market?`,
      okText: 'Confirm',
      onOk: async () => {
        const { key, page_code } = relation;
        const request: DeleteFormRelationReq = {
          key,
          page_code,
          key_type: KeyType.AREA_RULE,
        };
        try {
          await partnerOpAPIClient.DeleteFormRelation(request);
          Message.success('success');
          form.submit();
        } catch (err: any) {
          Message.error(err?.message ?? 'Unknown error');
        }
      },
    });
  };

  return (
    <div className="flex flex-col">
      <RouterLink
        className="no-underline text-brand font-semibold"
        to={PAGE_PATH_LIST.pageComponentEditPath + record?.relation?.page_id}>
        <Link title="Edit">Edit</Link>
      </RouterLink>
      <Link title="Remove" onClick={handleDelete}>
        Delete
      </Link>
    </div>
  );
};

export default TableActions;
