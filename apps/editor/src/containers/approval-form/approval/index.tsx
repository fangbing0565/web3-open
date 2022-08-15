import React, { useEffect, useState } from 'react';
import { CdnRender } from '@oec-open/ttspc-render';
import { partnerOpAPIClient } from '@/api/operation/serv/oec_operation_partner_op_api';
import { Message } from '@arco-design/web-react';
import { getQueryVariable } from '../util';
import ApprovalWFC from '../components/WFC';

const ApprovalFormDetail = () => {
  const [pageJson, setPageJson] = useState<any>(null);

  useEffect(() => {
    const instId = getQueryVariable('instId') || '';

    partnerOpAPIClient
      .FormPageWithDataQuery({
        approval_flow_instance_id: instId,
        approval_biz_type: 1,
      })
      .then(res => {
        if (res.schema) {
          const schema = JSON.parse(res.schema);
          if (typeof schema.content === 'string') {
            schema.content = JSON.parse(schema.content);
          }
          schema.content.body.editorMode = 'disabled';
          schema.content.body.buttonProps = {
            hiddenSearch: true,
          };

          setPageJson({
            form_info: res.form_values,
            schema,
          });
        }
      })
      .catch(err => {
        Message.error(err.message);
      });
  }, []);

  return (
    <>
      {pageJson ? (
        <CdnRender
          // showSubmit={true}
          cdn_url="https://sf-unpkg-src.bytedance.net/@oec-open/ttspc-render@1.0.4-beta.1/dist/umd/V1.0.4-BETA.1.js"
          json={pageJson.schema}
          formValues={pageJson.form_info}
          submitFetcher={async (values: Record<string, any>) => {
            console.log('values:----', values);
            return values;
          }}
        />
      ) : (
        <></>
      )}
      <ApprovalWFC />
    </>
  );
};

export default ApprovalFormDetail;
