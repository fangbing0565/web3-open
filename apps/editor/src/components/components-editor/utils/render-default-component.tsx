import { IField, IFormPage, ISection } from '@oec-open/ttspc-render';
import React, { useMemo } from 'react';
import { FORM_ITEM_TYPE } from '@m4b-design/pearl-schema-form';
import uuidv4 from '@i18n-ecom/lib/dist/commonjs/uuid';
import {
  initBizComponentDefaultSchema,
  initBizMagicComponentSchema,
} from './get-default-component-props';
import CdnGenForm from './factory-gen-form';
import { MAGIC_ITEM_TYPE } from './all-components-name';
import { EditorIPage } from './type';

export const getDefaultPageJson = (content: IFormPage): EditorIPage => ({
  page_type: 'formPage',
  id: 'id',
  version: '',
  sdk_url: '',
  sdk_version: '',
  name: '',
  creator: '',
  update_time: '',
  preview_urls: [],
  description: '',
  biz_component_group_ids: [],
  content,
});

export function renderDefaultComponent(componentKey: FORM_ITEM_TYPE) {
  const defaultSchema = initBizComponentDefaultSchema(componentKey);
  console.log({ componentKey, defaultSchema });
  const json: EditorIPage = getDefaultPageJson({
    body: {
      gutter: 8,
      sections: [
        {
          mode: 'search',
          type: 'section',
          layout: 'vertical',
          colSpan: {
            span: 24,
          },
          nodeId: 'id_id',
          title: '',
          children: defaultSchema,
        },
      ],
    },
  });

  return <CdnGenForm pageJson={json} />;
}

export function renderDefaultMagicComponent(componentKey: MAGIC_ITEM_TYPE) {
  const defaultSchema = initBizMagicComponentSchema(componentKey);
  console.log({ componentKey, defaultSchema });
  const json: EditorIPage = getDefaultPageJson({
    body: {
      gutter: 8,
      sections: [defaultSchema],
    },
  });

  return <CdnGenForm pageJson={json} />;
}

export function renderDefaultSection() {
  const json: EditorIPage = getDefaultPageJson({
    body: {
      gutter: 8,
      sections: [
        {
          type: 'section',
          layout: 'vertical',
          colSpan: {
            span: 24,
          },
          nodeId: 'id_id',
          title: 'Section Title',
          mode: 'search',
          children: [],
        },
      ],
    },
  });

  return <CdnGenForm pageJson={json} />;
}

export const groupStaticComponentRenderItem: {
  [key: string]: React.ReactNode;
} = {
  [FORM_ITEM_TYPE.DATE_RANGE_PICKER]: renderDefaultComponent(
    FORM_ITEM_TYPE.DATE_RANGE_PICKER,
  ),
  [FORM_ITEM_TYPE.DATE_PICKER]: renderDefaultComponent(
    FORM_ITEM_TYPE.DATE_PICKER,
  ),
  [FORM_ITEM_TYPE.IMAGE_UPLOAD]: renderDefaultComponent(
    FORM_ITEM_TYPE.IMAGE_UPLOAD,
  ),
  [FORM_ITEM_TYPE.TEXT_AREA]: renderDefaultComponent(FORM_ITEM_TYPE.TEXT_AREA),
  [FORM_ITEM_TYPE.SELECT]: renderDefaultComponent(FORM_ITEM_TYPE.SELECT),
  [FORM_ITEM_TYPE.RADIO]: renderDefaultComponent(FORM_ITEM_TYPE.RADIO),
  [FORM_ITEM_TYPE.FILE_UPLOAD]: renderDefaultComponent(
    FORM_ITEM_TYPE.FILE_UPLOAD,
  ),
  [FORM_ITEM_TYPE.INPUT]: renderDefaultComponent(FORM_ITEM_TYPE.INPUT),
  [FORM_ITEM_TYPE.BUTTON]: renderDefaultComponent(FORM_ITEM_TYPE.BUTTON),
  [FORM_ITEM_TYPE.SECTION]: renderDefaultSection(),
};

export const RenderCustomComponent = ({
  component,
}: {
  component: IField | ISection;
}) => {
  const json: EditorIPage = useMemo(() => {
    if (component.type === 'section') {
      const componentJson: ISection = JSON.parse(JSON.stringify(component));
      componentJson.nodeId = uuidv4();
      componentJson.children?.forEach((field: IField) => {
        field.nodeId = uuidv4();
        field.field = uuidv4();
      });
      return getDefaultPageJson({
        body: {
          gutter: 8,
          sections: [componentJson],
        },
      });
    } else {
      const componentJson: IField = JSON.parse(JSON.stringify(component));
      componentJson.nodeId = uuidv4();
      componentJson.field = uuidv4();
      return getDefaultPageJson({
        body: {
          gutter: 8,
          sections: [
            {
              type: 'section',
              layout: 'vertical',
              colSpan: {
                span: 24,
              },
              nodeId: 'id_id',
              title: '',
              mode: 'search',
              children: [componentJson],
            },
          ],
        },
      });
    }
  }, [component]);

  return <CdnGenForm pageJson={json} />;
};

export const magicStaticComponentRenderItem: {
  [key: string]: React.ReactNode;
} = {
  [MAGIC_ITEM_TYPE.DISABLED]: renderDefaultMagicComponent(
    MAGIC_ITEM_TYPE.DISABLED,
  ),
  [MAGIC_ITEM_TYPE.VISIBLE]: renderDefaultMagicComponent(
    MAGIC_ITEM_TYPE.VISIBLE,
  ),
};
