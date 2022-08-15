import createRequestModel from '@i18n-ecom-op/libs/createRequestModel';
import {
  categoryRuleAPIClient,
  GetRuleItemResponse,
} from '@/api/operation/serv/oec_operation_category_rule_api';

export const getRuleDetail = createRequestModel<GetRuleItemResponse, {}>(
  ({ query }) => {
    return categoryRuleAPIClient.GetRuleDetail({
      id: query.id,
    });
  },
);
