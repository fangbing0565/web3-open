import styled from 'styled-components';
import { QuestionIcon } from '@i18n-ecom/ui-icon';

export const ModalContainer = styled.div`
  && .arco-modal {
    width: 800px;
  }
  && .arco-input-inner-wrapper {
    padding: 0px 12px;
  }

  && .arco-col-18 {
    margin-bottom: 24px;
  }

  & .arco-form-label-item {
    font-size: 12px;
    line-height: 20px;
    font-weight: 600;
    color: #191d32;
  }

  & .arco-row {
    align-items: center;
    width: 100%;
  }

  && .arco-tree-select-view {
    height: 45px;
    border: 1px solid #d9dbe6;
  }
`;

export const QuestionTips = styled(QuestionIcon)`
  path {
    fill: #777d99;
  }
`;
