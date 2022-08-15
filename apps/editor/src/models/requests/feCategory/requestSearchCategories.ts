import createRequestModel from '@i18n-ecom-op/libs/createRequestModel';
import {
  operatorBackendAPIClient,
  SearchCategoryResponse,
} from '@/api/product/serv/oec_product_operator_backend_api';

import {
  categoryRuleAPIClient,
  ListFirstLevelCategoryResponse,
} from '@/api/operation/serv/oec_operation_category_rule_api';

export const requestSearchFeCategories = createRequestModel<
  SearchCategoryResponse,
  {}
>(({ query }) => {
  return categoryRuleAPIClient.SearchFeCategory({
    keyword: query.key_word || '',
    tree_id: query.tree_id,
    version_id: query.version_id,
    cursor: '0',
    size: 1000,
  });
});
