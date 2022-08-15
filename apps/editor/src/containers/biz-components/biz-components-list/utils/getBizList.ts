import {
    pageConfigAPIClient,
    QueryBizComponentGroupReq,
  } from '@/api/operation/serv/oec_operation_form_page_api';
  
  export const getBizList = async (query: Record<string, any>) => {
    const { id, name, biz_type } = query;
  
    const request: QueryBizComponentGroupReq = {
      id,
      name,
      biz_type,
    };
  
    const response = await pageConfigAPIClient.QueryBizComponentGroup(request);
  
    return {
      data: response?.biz_component_group,
      total: response?.biz_component_group?.length ?? 0,
    };
  };
  