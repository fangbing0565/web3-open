import createRequestModel from '@i18n-ecom-op/libs/createRequestModel';
import {
  operatorBackendAPIClient,
  SearchCategoryResponse,
} from '@/api/product/serv/oec_product_operator_backend_api';

export const requestSearchCategories = createRequestModel<
  SearchCategoryResponse,
  {}
>(({ query }) => {
  return operatorBackendAPIClient.SearchCategory({
    status: query.status === 0 ? undefined : query.status,
    key_word: query.key_word || '',
    category_id: query.key_word || undefined,
  });
});
