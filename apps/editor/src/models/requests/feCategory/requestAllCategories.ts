import createRequestModel from '@i18n-ecom-op/libs/createRequestModel';
import {
  operatorBackendAPIClient,
  ListChildCategoriesResponse,
} from '@/api/product/serv/oec_product_operator_backend_api';
import {
  categoryRuleAPIClient,
  ListFirstLevelCategoryResponse,
} from '@/api/operation/serv/oec_operation_category_rule_api';

export const requestAllFeCategories = createRequestModel<
  ListFirstLevelCategoryResponse,
  {}
>(({ query: { tree_id, version_id } }) => {
  return categoryRuleAPIClient.ListFirstLevelCategory({
    tree_id,
    version_id,
  });
});
