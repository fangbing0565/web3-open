import React, { useEffect, useState } from 'react';
import { CdnRender } from '@oec-open/ttspc-render';
import { partnerOpAPIClient } from '@/api/operation/serv/oec_operation_partner_op_api';
import { DatePicker, Message, Upload } from '@arco-design/web-react';
import { uploadWass } from '@oec-open/ttspc-kits';
import { getQueryVariable } from '../util';
import ApprovalWFC from '../components/WFC';

const CustomDateRangePicker = (props: any) => (
  <DatePicker.RangePicker
    {...props}
    onChange={val => {
      props.onChange(val);
    }}
  />
);
const CustomDatePicker = (props: any) => (
  <DatePicker
    {...props}
    onChange={val => {
      props.onChange(val);
    }}
  />
);

const CustomUpload = (props: any) => {
  const handleUpload = async (options: any) => {
    console.log('options', options);
    const { onError, onSuccess, file } = options;
    return uploadWass(file)
      .then(res => {
        console.log(res, file);
        const { uri, oid } = res;

        console.log({ uri, oid });

        onSuccess('');
        return { uri, oid };
      })
      .catch(err => {
        onError(err);
      });
  };
  return (
    <Upload
      {...props}
      fileList={props.value?.map((e: any) => ({
        ...e,
        url: e.uri,
      }))}
      multiple={true}
      listType="picture-card"
      customRequest={options => {
        handleUpload(options).then((res: any) => {
          props.onChange([
            ...(props.value
              .filter((e: any) => e.oid)
              .map((e: any) => ({
                oid: e.oid,
                uri: e.uri,
              })) || []),
            res,
          ]);
        });
      }}
    />
  );
};

const ServiceAuditFormDetail = () => {
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

          if (res.form_values) {
            res.form_values.forEach(item => {
              try {
                item.value = JSON.parse(item.value);
              } catch (err) {
                item.value = '';
              }
            });
          }

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
          componentsMap={{
            company_logo: (props: any) => <CustomUpload {...props} />,
            entity_certificate_image: (props: any) => (
              <CustomUpload {...props} />
            ),
            biz_owner_id_types: (props: any) => <CustomUpload {...props} />,
            biz_owner_id_image: (props: any) => <CustomUpload {...props} />,
            business_register_data: (props: any) => (
              <CustomDatePicker {...props} />
            ),
            tax_register_data: (props: any) => <CustomDatePicker {...props} />,
            business_period: (props: any) => (
              <CustomDateRangePicker {...props} />
            ),
          }}
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

export default ServiceAuditFormDetail;
