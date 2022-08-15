import {
    partnerOpAPIClient,
    QueryServiceableAreaRuleExtendReq,
    SceneType,
  } from '@/api/operation/serv/oec_operation_partner_op_api';
  
  export const getList: any = async (query: Record<string, any>) => {
    const {
      partner_country_code_modal,
      category_id_modal,
      seller_market_modal,
    } = query;
  
    if (partner_country_code_modal) {
      const request: QueryServiceableAreaRuleExtendReq = {
        is_paging: false,
        scene_type: SceneType.SELECT,
        partner_country_code: partner_country_code_modal,
        category_id: category_id_modal,
        seller_market: seller_market_modal,
      };
  
      const response = await partnerOpAPIClient.QueryServiceableAreaRuleExtend(
        request,
      );
  
      return { data: response?.service_area_rule_extend ?? [] };
    } else {
      return { data: [] };
    }
  };
  