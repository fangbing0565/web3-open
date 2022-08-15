import createRequestModel from '@i18n-ecom-op/libs/createRequestModel';
import {
  categoryRuleAPIClient,
  GetCategoryDetailResponse,
} from '@/api/operation/serv/oec_operation_category_rule_api';

export const getFeCategoryDetail = createRequestModel<
  GetCategoryDetailResponse,
  {}
>(({ query }) => {
  return categoryRuleAPIClient.GetFeCategoryDetail({
    tree_id: query.tree_id,
    version_id: query.version_id,
    category_id: query.category_id,
  });
});
