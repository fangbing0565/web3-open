import {
    partnerOpAPIClient,
    QueryServiceableAreaRuleExtendReq,
    SceneType,
  } from '@/api/operation/serv/oec_operation_partner_op_api';
  
  export const getList = async (query: Record<string, any>) => {
    console.log('query--->', query);
  
    const {
      current,
      pageSize,
      partner_country_code,
      category_id,
      seller_market,
    } = query;
  
    const request: QueryServiceableAreaRuleExtendReq = {
      is_paging: true,
      size: pageSize,
      scene_type: SceneType.MODIFY,
      offset: (current - 1) * pageSize,
      partner_country_code,
      category_id,
      seller_market,
    };
  
    const response = await partnerOpAPIClient.QueryServiceableAreaRuleExtend(
      request,
    );
    return {
      data: response?.service_area_rule_extend,
      total: response?.total ?? 0,
    };
  };
  