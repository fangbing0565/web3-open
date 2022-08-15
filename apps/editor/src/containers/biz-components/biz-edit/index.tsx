import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BizComponentEditor, {
  EDITOR_TYPE,
} from '@/components/components-editor';
import { IField, IFormPage, ISection } from '@oec-open/ttspc-render';
import {
  BizComponentGroup,
  pageConfigAPIClient,
} from '@/api/operation/serv/oec_operation_form_page_api';
import { Message } from '@arco-design/web-react';
import { useParams } from 'react-router-dom';
import { FormValueType } from '@/api/operation/data/form_page';
import { EditorIPage } from '@/components/components-editor/utils/type';

export type BizGroupComponet = {
  normalSection: ISection;
  magicSections: ISection[];
};

const BizEdit = () => {
  const [defaultPageJson, setDefaultJson] = useState<EditorIPage>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [bizPageJson, setBizPageJson] = useState<BizComponentGroup>();

  const getCurrentJson = useCallback(() => {
    setLoading(true);
    pageConfigAPIClient
      .QueryBizComponentGroup({ id })
      .then(res => {
        if (res.code === 0 && res.biz_component_group?.length) {
          setBizPageJson(res.biz_component_group[0]);
          setLoading(false);
          try {
            const groupItem = res?.biz_component_group[0];
            const content: BizGroupComponet =
              JSON.parse(groupItem?.content) || {};
            const { normalSection, magicSections } = content;
            const sections: ISection[] = [
              normalSection || {
                nodeId: 'node_normal',
                type: 'section',
                title: 'Biz Group Components',
                mode: 'search',
                colSpan: {
                  span: 24,
                },
                children: [],
              },
            ];
            sections.push(...(magicSections || []));
            const components: IFormPage = {
              body: {
                gutter: 16,
                sections,
              },
            };
            let page_options = {};
            if (groupItem?.page_options) {
              try {
                page_options = JSON.parse(groupItem.page_options);
              } catch (error) {
                page_options = {};
              }
            }

            const form: EditorIPage = {
              id: '',
              version: '',
              sdk_version: '',
              sdk_url: '',
              name: groupItem.name,
              page_type: 'formPage',
              creator: '',
              update_time: '',
              preview_urls: [],
              description: groupItem.description,
              biz_component_group_ids: [],
              content: components,
              page_options,
            };

            setDefaultJson(form);
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

  const updatePage = useCallback(
    (pageJson: EditorIPage) => {
      const {
        content: { body },
      } = pageJson;
      const normalSection = body.sections[0];
      const magicSections = body.sections.slice(1);
      const json: BizComponentGroup = JSON.parse(JSON.stringify(bizPageJson));
      console.log({ json });
      json.name = pageJson.name || '';
      json.description = pageJson.description || '';
      json.content = JSON.stringify({
        normalSection,
        magicSections,
      });
      console.log({ pageJson });
      json.page_options = JSON.stringify(pageJson.page_options);
      const list: {
        type: FormValueType;
        field: string;
      }[] = [];
      body.sections.forEach((section: ISection) => {
        section?.children?.forEach((filed: IField) => {
          list.push({
            type: FormValueType.SELECT,
            field: filed.field,
          });
        });
      });
      json.field_type_list = list;
      return pageConfigAPIClient.UpdateBizComponentGroup({
        biz_component_group: json,
      });
    },
    [bizPageJson],
  );

  useEffect(getCurrentJson, []);

  return defaultPageJson && bizPageJson ? (
    <BizComponentEditor
      defaultPageJson={defaultPageJson}
      editorType={EDITOR_TYPE.BIZ_GROUP}
      saveJsonApi={updatePage}
      bizType={bizPageJson?.biz_type}
    />
  ) : (
    <></>
  );
};

export default BizEdit;

// magic = [
//   {
//     type: 'magic',
//     children: [
//       {
//         section,
//       },
//       {
//         section,
//       }
//     ]
//   }
// ]
