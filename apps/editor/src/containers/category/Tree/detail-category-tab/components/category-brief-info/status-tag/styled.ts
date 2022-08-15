import styled from 'styled-components';
import { Tag } from '@i18n-ecom/ui';

export const StatusWrapper = styled(Tag)<{
  textColor: string;
  backgroundColor: string;
}>`
  background-color: ${props => props.backgroundColor};
  color: ${props => props.textColor};
  font-weight: 600;
  font-size: 12px;
  text-align: center;
`;
