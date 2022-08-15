import styled from 'styled-components';
import { Text } from '@i18n-ecom-op/components';

export const CategoryBriefInfoContainer = styled.div`
  & .arco-descriptions-item-value {
    color: #777d99;
    font-size: 14px;
  }

  & .arco-descriptions-table {
    word-break: break-all;
  }

  .category-name {
    font-weight: 600;
    font-size: 14px;
    line-height: 27px;
    color: #191d32;
  }
`;

export const IDContainer = styled.div`
  width: 120px;
  margin-right: 8px;
`;

export const PathContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;
