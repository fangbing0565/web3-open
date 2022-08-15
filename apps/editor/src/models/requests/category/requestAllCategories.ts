import createRequestModel from '@i18n-ecom-op/libs/createRequestModel';
import {
  operatorBackendAPIClient,
  ListChildCategoriesResponse,
} from '@/api/product/serv/oec_product_operator_backend_api';
import {
  categoryRuleAPIClient,
  ListOPCategoriesResponse,
} from '@/api/operation/serv/oec_operation_category_rule_api';

export const requestAllCategories = createRequestModel<
  ListOPCategoriesResponse,
  {}
>(({ query: { category_status, audit_status, category_id } }) => {
  return categoryRuleAPIClient.ListOPChildrenCategories({
    category_status: category_status === 0 ? undefined : category_status,
    audit_status,
    category_id,
  });
});
