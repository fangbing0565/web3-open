import createRequestModel from '@i18n-ecom-op/libs/createRequestModel';
import {
  categoryRuleAPIClient,
  GetCategoryRulesResponse,
  GetCategoryRulesRequest,
} from '@/api/operation/serv/oec_operation_category_rule_api';

export const getCategoryRules = createRequestModel<
  GetCategoryRulesResponse,
  {}
>(({ query }) => {
  const dimensionRegion = query.region?.split('-')?.[0];
  const dimensionSaleType = Number(query.region?.split('-')?.[1]);
  const req: GetCategoryRulesRequest = {
    category_id: query.category_id,
    region: dimensionRegion,
    sale_type: dimensionSaleType,
  };
  return categoryRuleAPIClient.GetCategoryRules(req);
});
