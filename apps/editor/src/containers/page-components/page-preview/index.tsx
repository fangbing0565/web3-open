import React, { useState, useEffect } from 'react';
import { Message, Spin } from '@i18n-ecom/ui';
import { IPage, CdnRender } from '@oec-open/ttspc-render';
import { useParams } from 'react-router-dom';
import { pageConfigAPIClient } from '@/api/operation/serv/oec_operation_form_page_api';
import { Button } from '@arco-design/web-react';
import { useHistory } from '@jupiter/plugin-runtime/router';
import { areaOptions, regionOptions } from './constants/options';

const ApplyCertPage = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<IPage>();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const getPageView = () => {
    setLoading(true);
    pageConfigAPIClient
      .QueryPage({ id })
      .then(res => {
        console.log({ res });
        if (res.code === 0 && res.pages) {
          setLoading(false);
          try {
            res.pages[0].content = JSON.parse(res?.pages[0]?.content);
            setContent(res?.pages[0] as any);
          } catch (error) {
            Message.error('error');
          }
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
    <>
      <Spin size={24} loading={loading} style={{ display: 'block' }}>
        <Button
          onClick={() => {
            history.goBack();
          }}>
          Back
        </Button>
        {content && (
          <CdnRender
            cdn_url="https://sf-unpkg-src.bytedance.net/@oec-open/ttspc-render@1.0.4-alpha.23/dist/umd/V1.0.4-ALPHA.23.js"
            json={content}
            optionsMap={{
              category: [{ id: '1', label: '中国', value: '1' }],
              region: regionOptions,
              area: areaOptions,
            }}
            submitFetcher={async (values: Record<string, any>) => {
              console.log('values', values);
              return values;
            }}
          />
        )}
      </Spin>
    </>
  );
};
export default ApplyCertPage;
