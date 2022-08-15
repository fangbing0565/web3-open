import createRequestModel from '@i18n-ecom-op/libs/createRequestModel';
import {
  categoryRuleAPIClient,
  GetCategoryDetailResponse,
} from '@/api/operation/serv/oec_operation_category_rule_api';

export const getCategoryDetail = createRequestModel<
  GetCategoryDetailResponse,
  {}
>(({ query }) => {
  return categoryRuleAPIClient.GetCategoryDetail({
    category_id: query.category_id,
  });
});
