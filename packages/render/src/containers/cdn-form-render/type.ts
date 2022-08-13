import { FormInstance } from '@arco-design/web-react';
import { CSSProperties } from 'react';
import { GenFormProps } from '../gen-form/type';

declare type KeyType = string | number | symbol;
export interface IRenderProps extends GenFormProps {
  cdn_url: string;
}
