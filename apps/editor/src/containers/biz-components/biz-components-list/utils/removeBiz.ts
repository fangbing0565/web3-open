import {
    pageConfigAPIClient,
    DeleteBizComponentGroupReq,
  } from '@/api/operation/serv/oec_operation_form_page_api';
  import { FormInstance } from '@arco-design/web-react/es/Form';
  import { Message } from '@arco-design/web-react';
  
  export const removeBiz = (id: string, formRef: FormInstance) => {
    const request: DeleteBizComponentGroupReq = { biz_component_group_id: id };
  
    pageConfigAPIClient
      .DeleteBizComponentGroup(request)
      .then(res => {
        formRef.submit();
        Message.success('success');
      })
      .catch(err => {
        Message.error(err.message);
      });
  };
  