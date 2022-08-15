import createRequestModel from '@i18n-ecom-op/libs/createRequestModel';
import {
  operatorBackendAPIClient,
  ListCategoryStatusResponse,
} from '@/api/product/serv/oec_product_operator_backend_api';

export const requestAllCategoryStatus = createRequestModel<
  ListCategoryStatusResponse,
  {}
>(() => {
  return operatorBackendAPIClient.ListCategoryStatus({});
});
