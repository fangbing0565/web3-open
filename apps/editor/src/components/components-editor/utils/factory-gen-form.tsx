import React from 'react';
import ReactDom from 'react-dom';
import { CdnRender, GenFormProps } from '@oec-open/ttspc-render';
import { EditorIPage } from './type';

window.reactDom = ReactDom;

type IProps = Partial<GenFormProps> & { pageJson: EditorIPage };

const CdnGenForm = React.memo(
  (props: IProps) => {
    const { pageJson, ...others } = props;
    const json = JSON.parse(JSON.stringify(pageJson));
    json.page_options = JSON.stringify(json.page_options);
    console.log({ json });
    return (
      <CdnRender
        cdn_url="https://sf-unpkg-src.bytedance.net/@oec-open/ttspc-render@1.0.4-alpha.30/dist/umd/V1.0.4-ALPHA.30.js"
        json={json}
        submitFetcher={async (values: Record<string, any>) => {
          return values;
        }}
        {...others}
      />
    );
  },
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.pageJson) === JSON.stringify(nextProps.pageJson),
);

export default CdnGenForm;
