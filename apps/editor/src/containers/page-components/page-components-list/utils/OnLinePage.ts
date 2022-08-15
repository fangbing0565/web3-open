import {
    pageConfigAPIClient,
    OnlinePageReq,
  } from '@/api/operation/serv/oec_operation_form_page_api';
  import { FormInstance } from '@arco-design/web-react/es/Form';
  import { Message } from '@arco-design/web-react';
  
  export const OnLinePage = (id: string, formRef: FormInstance) => {
    const request: OnlinePageReq = { page_id: id };
    console.log('request', request);
  
    pageConfigAPIClient
      .OnlinePage(request)
      .then(res => {
        console.log('res===>', res);
        formRef.submit();
        Message.success('success');
      })
      .catch(err => {
        console.log('err', err);
        Message.error(err.message);
      });
  };
  