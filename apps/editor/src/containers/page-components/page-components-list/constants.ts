import {
    PageType,
    PageOnlineStatus,
  } from '@/api/operation/serv/oec_operation_form_page_api';
  
  export const DefaultColSpan: {
    span: number;
    style: {
      padding: string;
    };
  } = {
    span: 8,
    style: {
      padding: '0 16px',
    },
  };
  
  export const pageTypeList = [
    {
      label: 'Form',
      value: PageType.FORM,
    },
  ];
  
  export const pageTypeFun = (col?: number) => {
    let label;
    pageTypeList.forEach(item => {
      if (col && item.value === col) {
        label = item.label;
      }
    });
    return label;
  };
  
  export const pageOnlineStatus = [
    {
      text: 'Online Page',
      value: PageOnlineStatus.ONLINE,
    },
    {
      text: 'Offline Page',
      value: PageOnlineStatus.PRE_ONLINE,
    },
  ];
  