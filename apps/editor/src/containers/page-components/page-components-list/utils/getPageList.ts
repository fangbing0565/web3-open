import {
    pageConfigAPIClient,
    QueryPageReq,
  } from '@/api/operation/serv/oec_operation_form_page_api';
  
  export const getPageList = async (
    query: Record<string, any>,
    pageTab: number,
  ) => {
    const {
      id,
      name,
      page_version,
      page_code,
      bizType,
      page_type,
      current,
    } = query;
    console.log('query---->', query);
  
    const request: QueryPageReq = {
      id,
      name,
      page_version,
      page_code,
      biz_type: bizType,
      page_type,
      page_online_status: pageTab,
    };
  
    const response = await pageConfigAPIClient.QueryPage(request);
    return {
      data: response?.pages,
      total: response?.total ?? 0,
    };
  };
  