import React from 'react';
import { IRenderProps } from './type';
import { useLoaderPreset } from './util';
import ProForm from '@m4b-design/pearl-pro-form';
import * as ReactDOM from 'react-dom';
import * as Arco from '@arco-design/web-react/dist/arco.min.js';

(window as any).react = React;
(window as any).reactDOM = ReactDOM;
(window as any).webReact = Arco;

export const CdnRender: React.FC<IRenderProps> = props => {
  const { cdn_url, ...others } = props;
  const SDKRender = useLoaderPreset(cdn_url);
  return (
    <div>
      {!SDKRender ? (
        <div></div>
      ) : (
        <SDKRender.GenForm {...others}></SDKRender.GenForm>
      )}
    </div>
  );
};
