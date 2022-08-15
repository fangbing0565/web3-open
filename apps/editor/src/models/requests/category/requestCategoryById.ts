import createRequestModel from '@i18n-ecom-op/libs/createRequestModel';
import {
  operatorBackendAPIClient,
  SearchCategoryResponse,
} from '@/api/product/serv/oec_product_operator_backend_api';

export const requestCategoryById = createRequestModel<
  SearchCategoryResponse,
  {}
>(({ query }) => {
  return operatorBackendAPIClient.SearchCategory({
    category_id: query.category_id,
  });
});
