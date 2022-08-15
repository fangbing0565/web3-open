import React, { useState, useEffect } from 'react';
import ProForm from '@m4b-design/pearl-pro-form';
import { CdnRender, IPage } from '@oec-open/ttspc-render';
import { useParams } from 'react-router-dom';
import { Message, Spin } from '@i18n-ecom/ui';
// import json from './constants/page.json';
import { pageConfigAPIClient } from '@/api/operation/serv/oec_operation_form_page_api';

const json: IPage = {
  id: 'hash001',
  version: '1.0.1',
  name: 'Partner certificate',
  page_type: 'formPage',
  sdk_version: '',
  sdk_url: '',
  creator: '',
  update_time: '',
  preview_urls: [],
  description: '',
  biz_component_group_ids: [],
  content: {
    body: {
      gutter: 8,
      sections: [
        {
          type: 'section',
          title: 'Certificate',
          layout: 'vertical',
          colSpan: {
            span: 24,
          },
          nodeId: 'field_1',
          children: [
            {
              nodeId: 'entity_ertificate',
              field: 'entity_ertificate',
              bizType: 0,
              type: 'imageUpload',
              label: 'Entity Certificate',
              information: '1-2 pictures are allowed. For best quality.',
              customProps: {
                limit: 2,
              },
            },
            {
              nodeId: 'entity_ertificate_number',
              field: 'entity_ertificate_number',
              bizType: 0,
              type: 'input',
              label: 'Entity Certificate Number',
              customProps: {
                placeholder: 'Entity Certificate Number',
                maxLength: { length: 100, errorOnly: 'true' },
                showWordLimit: 'true',
              },
            },
          ],
        },
        {
          type: 'section',
          title: 'Company',
          layout: 'vertical',
          colSpan: {
            span: 24,
          },
          nodeId: 'field_2',
          children: [
            {
              nodeId: 'company_logo',
              field: 'company_logo',
              bizType: 0,
              type: 'imageUpload',
              label: 'Company Logo',
              information: '1-2 pictures are allowed. For best quality.',
              customProps: {
                limit: 2,
              },
            },
            {
              nodeId: 'company_name',
              field: 'company_name',
              bizType: 0,
              type: 'input',
              label: 'Company Name',
              customProps: {
                placeholder: 'Enter the company name',
                maxLength: { length: 100, errorOnly: 'true' },
                showWordLimit: 'true',
              },
            },
            {
              nodeId: 'company_license_no',
              field: 'company_license_no',
              bizType: 0,
              type: 'input',
              label: 'Company License No',
              customProps: {
                placeholder: 'Company License No',
                maxLength: { length: 100, errorOnly: 'true' },
                showWordLimit: 'true',
              },
            },
            {
              nodeId: 'company_license',
              field: 'company_license',
              bizType: 0,
              type: 'fileUpload',
              label: 'Company License',
            },
          ],
        },
      ],
    },
  },
};

const BizPreview = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { id } = useParams<{ id: string }>();

  const getPageView = () => {
    setLoading(true);
    pageConfigAPIClient
      .QueryBizComponentGroup({ id })
      .then(res => {
        if (res.code === 0 && res.biz_component_group) {
          setLoading(false);
          setContent(res?.biz_component_group[0]?.content);
        } else {
          setLoading(false);
          Message.error(res.message);
        }
      })
      .catch(err => {
        setLoading(false);
        Message.error(err.message);
      });
  };

  useEffect(() => {
    getPageView();
  }, []);

  return (
    <Spin size={24} loading={loading} style={{ display: 'block' }}>
      {content && (
        <CdnRender
          cdn_url="https://sf-unpkg-src.bytedance.net/@oec-open/ttspc-render@1.0.4-alpha.23/dist/umd/V1.0.4-ALPHA.23.js"
          json={json}
          optionsMap={{
            category: [{ id: '1', label: '中国', value: '1' }],
          }}
          submitFetcher={async (values: Record<string, any>) => {
            console.log('values', values);
            return values;
          }}
        />
      )}
    </Spin>
  );
};

export default BizPreview;
