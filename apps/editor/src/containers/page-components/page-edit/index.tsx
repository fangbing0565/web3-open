import React, { useCallback, useEffect, useState } from 'react';
import BizComponentEditor, {
  EDITOR_TYPE,
} from '@/components/components-editor';
import { pageConfigAPIClient } from '@/api/operation/serv/oec_operation_form_page_api';
import { Message } from '@arco-design/web-react';
import { useParams } from 'react-router-dom';
import { EditorIPage } from '@/components/components-editor/utils/type';

const PageEdit = () => {
  const [defaultPageJson, setDefaultJson] = useState<EditorIPage>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  const getCurrentJson = useCallback(() => {
    setLoading(true);
    pageConfigAPIClient
      .QueryPage({ id })
      .then(res => {
        console.log({ res });
        if (res.code === 0 && res.pages) {
          setLoading(false);
          try {
            res.pages[0].content = JSON.parse(res?.pages[0]?.content);
            let page_options = {};
            if (res.pages[0]?.page_options) {
              try {
                page_options = JSON.parse(res.pages[0].page_options);
              } catch (error) {
                page_options = {};
              }
            }
            setDefaultJson({
              ...res.pages[0],
              page_options,
            } as any);
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
  }, []);

  const updatePage = useCallback((pageJson: EditorIPage) => {
    const json = JSON.parse(JSON.stringify(pageJson));
    json.content = JSON.stringify(json.content) as any;
    json.page_options = JSON.stringify(pageJson.page_options);

    return pageConfigAPIClient.UpdatePage({
      page: json,
    });
  }, []);

  useEffect(getCurrentJson, []);

  return defaultPageJson ? (
    <BizComponentEditor
      editorType={EDITOR_TYPE.BIZ_PAGE}
      defaultPageJson={defaultPageJson}
      saveJsonApi={updatePage}
      bizType={0}
    />
  ) : (
    <></>
  );
};

export default PageEdit;
