import { IField, IFormPage, ISection } from '@oec-open/ttspc-render';
import React from 'react';
import { FORM_ITEM_TYPE } from '@m4b-design/pearl-schema-form';
import { Modal, Button } from '@arco-design/web-react';
import { EDITOR_TYPE } from '..';
import { setObjKey } from './utils';
import {
  generatorBizSectionDefaultSchema,
  getNodeIdKey,
  initBizComponentDefaultSchema,
  initBizMagicComponentSchema,
  validateNodeId,
} from './get-default-component-props';
import { MAGIC_ITEM_TYPE } from './all-components-name';
import {
  getCurrentTargetById,
  getRelationFieldIds,
} from './create-click-button';
import { EditorIPage } from './type';

export enum SCHEMA_ACTION {
  ADD_FIELD = 'ADD_FIELD',
  DELETE_BY_NODEID = 'DELETE_BY_NODEID',
  UPDATE_JSON = 'UPDATE_JSON',
  ADD_SECTION = 'ADD_SECTION',
  EXCHANGE_SECTION = 'EXCHANGE_SECTION',
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN',
  EXCHANGE_FIELD = 'EXCHANGE_FIELD',
  UPDTAE_FIELD_BY_NODEID = 'UPDTAE_FIELD_BY_NODEID',
  ADD_CUSTOM_FIELD = 'ADD_CUSTOM_FIELD',
  UPDATE_PAGE_JSON = 'UPDATE_PAGE_JSON',
}

type AddFieldType = {
  data: {
    toSectionIndex: number;
    toFieldIndex: number;
    componentKey: FORM_ITEM_TYPE;
  };
};

type AddSectionType = {
  data: {
    newSectionIndex: number;
    bizType: string;
    bizKey: string;
  };
};

type UpdateJsonType = {
  data: EditorIPage;
};

type ExchangeSectionType = {
  data: {
    oldSectionIndex: number;
    newSectionIndex: number;
  };
};

type ExchangeFieldType = {
  data: {
    oldSectionIndex: number;
    newSectionIndex: number;
    oldFieldIndex: number;
    newFieldIndex: number;
  };
};

type NodeIdType = {
  nodeId: string;
};

type UpdateFieldType = {
  nodeId: string;
  data: {
    field: string;
    data: any;
  };
};

type AddCustomFieldType = {
  data: {
    toSectionIndex: number;
    toFieldIndex: number;
    fieldId: string;
    componnetType: 'custom' | 'magic';
  };
};

type UpdatePageJsonType = {
  data: {
    field: string;
    data: any;
  };
};

const updateEffects = (json?: EditorIPage) => {
  json?.content.body.sections.forEach(section => {
    section.children?.forEach((field: IField) => {
      const { required, requiredText, rules } =
        field.customProps?.validatorRules || {};
      const rulesRes = [];
      if (required) {
        rulesRes.push({
          required: true,
          message: requiredText || `${field.field} is required`,
        });
      }
      // rules.forEach((r: ValidatorRuleItem) => {});
      field.rules = rulesRes;
    });
  });
};

export const updateCurrentTagretFieldById = (
  schemaJson: IFormPage,
  currentTargetId: string,
  fieldString: string,
  data: IField | ISection,
) => {
  if (!currentTargetId) {
    return schemaJson;
  }

  schemaJson.body.sections.find((section: ISection, sectionIndex) => {
    if (section.nodeId === currentTargetId) {
      setObjKey(schemaJson.body.sections[sectionIndex], fieldString, data);
      return true;
    }
    return section.children?.find((field: IField, fieldIndex) => {
      if (field.nodeId === currentTargetId) {
        if (!section.children?.length) {
          return false;
        }
        setObjKey(section.children[fieldIndex], fieldString, data);
        return true;
      }
      return false;
    });
  });
  return schemaJson;
};

export const updateCurrentTargetById = (
  schemaJson: IFormPage,
  currentTargetId: string,
  data: IField | ISection,
) => {
  if (!currentTargetId) {
    return schemaJson;
  }

  schemaJson.body.sections.find((section: ISection, sectionIndex) => {
    if (section?.nodeId === currentTargetId) {
      schemaJson.body.sections[sectionIndex] = data as ISection;
      return true;
    }
    return section.children?.find((field: IField, fieldIndex) => {
      if (field?.nodeId === currentTargetId) {
        if (!section.children?.length) {
          section.children = [];
        }
        section.children[fieldIndex] = data as IField;
        return true;
      }
      return false;
    });
  });
  return schemaJson;
};

export const updatePageJsonItem = (
  pageJson: EditorIPage,
  field: string,
  data: string,
) => {
  if (!field) {
    return;
  }
  if (field === 'name' || field === 'description') {
    pageJson[field] = data;
  } else if (/^page_options\.(.*)/.test(field)) {
    const key = RegExp.$1;
    if (pageJson && (key === 'i18n_key' || key === 'name_space')) {
      if (
        !pageJson.page_options ||
        Object.prototype.toString.call(pageJson.page_options) !==
          '[object Object]'
      ) {
        pageJson.page_options = {};
      }
      pageJson.page_options[key] = data;
    }
  }
};

export const removeTargetByIds = (
  schemaJson: IFormPage,
  currentTargetIds: string[],
) => {
  if (!currentTargetIds.length) {
    return schemaJson;
  }

  currentTargetIds
    .filter(e => e)
    .forEach(currentTargetId => {
      schemaJson.body.sections.find((section: ISection, sectionIndex) => {
        if (section?.nodeId === currentTargetId) {
          schemaJson.body.sections.splice(sectionIndex, 1);
          return true;
        }
        const isFind = section.children?.find((field: IField, fieldIndex) => {
          if (field.nodeId === currentTargetId) {
            section.children?.splice(fieldIndex, 1);
            return true;
          }
          return false;
        });
        return isFind;
      });
    });
  return schemaJson;
};

export const moveUpByNodeId = (schemaJson: IFormPage, nodeId: string) =>
  moveNode({
    direction: 'up',
    schemaJson,
    nodeId,
  });

export const moveDownByNodeId = (schemaJson: IFormPage, nodeId: string) =>
  moveNode({
    direction: 'down',
    schemaJson,
    nodeId,
  });

export const moveNode = ({
  direction,
  schemaJson,
  nodeId,
}: {
  direction: 'down' | 'up';
  schemaJson: IFormPage;
  nodeId: string;
}) => {
  const sections = schemaJson.body.sections;
  sections.find((section: ISection, sectionIndex) => {
    if (section?.nodeId === nodeId) {
      if (
        (direction === 'down' && sectionIndex === sections.length - 1) ||
        (direction === 'up' && sectionIndex === 0)
      ) {
        return true;
      } else {
        const toIndex = sectionIndex + (direction === 'down' ? 1 : -1);
        [sections[sectionIndex], sections[toIndex]] = [
          sections[toIndex],
          sections[sectionIndex],
        ];
      }
      return true;
    }
    const sectionChildren = section.children;
    return sectionChildren?.find((field: IField, fieldIndex) => {
      if (field.nodeId === nodeId) {
        if (direction === 'up') {
          if (fieldIndex === 0 && sectionIndex === 0) {
            return true;
          }
          if (fieldIndex === 0) {
            const item = sectionChildren?.shift();
            sections?.[sectionIndex - 1]?.children?.push(item as IField);
            return true;
          }
        } else {
          if (
            fieldIndex === (sectionChildren?.length || 0) - 1 &&
            sectionIndex === sections.length - 1
          ) {
            return true;
          }
          if (fieldIndex === (sectionChildren?.length || 0) - 1) {
            sections[sectionIndex + 1].children?.unshift(
              sectionChildren?.pop() as IField,
            );
            return true;
          }
        }
        const toIndex = fieldIndex + (direction === 'down' ? 1 : -1);
        if (!sectionChildren?.length) {
          return false;
        }
        [sectionChildren[fieldIndex], sectionChildren[toIndex]] = [
          sectionChildren[toIndex],
          sectionChildren[fieldIndex],
        ];
        return true;
      }
      return false;
    });
  });
};

export type SchemaActionType =
  | {
      type: SCHEMA_ACTION.MOVE_DOWN;
      payload: NodeIdType;
    }
  | {
      type: SCHEMA_ACTION.MOVE_UP;
      payload: NodeIdType;
    }
  | {
      type: SCHEMA_ACTION.DELETE_BY_NODEID;
      payload: NodeIdType;
    }
  | {
      type: SCHEMA_ACTION.EXCHANGE_FIELD;
      payload: ExchangeFieldType;
    }
  | {
      type: SCHEMA_ACTION.EXCHANGE_SECTION;
      payload: ExchangeSectionType;
    }
  | {
      type: SCHEMA_ACTION.UPDATE_JSON;
      payload: UpdateJsonType;
    }
  | {
      type: SCHEMA_ACTION.ADD_SECTION;
      payload: AddSectionType;
    }
  | {
      type: SCHEMA_ACTION.ADD_FIELD;
      payload: AddFieldType;
    }
  | {
      type: SCHEMA_ACTION.ADD_CUSTOM_FIELD;
      payload: AddCustomFieldType;
    }
  | {
      type: SCHEMA_ACTION.UPDTAE_FIELD_BY_NODEID;
      payload: UpdateFieldType;
    }
  | {
      type: SCHEMA_ACTION.UPDATE_PAGE_JSON;
      payload: UpdatePageJsonType;
    };

export type SetSchemaJsonType = {
  action: SchemaActionType;
  pageJson?: EditorIPage;
  setPageJson?: any;
  bizComponents?: {
    normalSection: ISection;
    magicSections: ISection[];
  };
  bizType: number;
  editorType: EDITOR_TYPE;
};

export const setJson = ({
  action,
  pageJson,
  setPageJson,
  bizComponents,
  bizType,
  editorType,
}: SetSchemaJsonType) => {
  let json: EditorIPage = JSON.parse(JSON.stringify(pageJson));

  switch (action.type) {
    case SCHEMA_ACTION.ADD_FIELD:
      const {
        data: { toSectionIndex, toFieldIndex, componentKey },
      } = action.payload;
      const newList =
        json?.content?.body?.sections[toSectionIndex]?.children || [];
      const newItem = initBizComponentDefaultSchema(
        componentKey,
        json?.content,
      )?.[0];
      newItem.bizType = bizType;
      newList.splice(toFieldIndex, 0, newItem);
      break;

    case SCHEMA_ACTION.ADD_CUSTOM_FIELD:
      {
        const {
          data: { toSectionIndex, toFieldIndex, fieldId, componnetType },
        } = action.payload;
        const newList =
          json?.content?.body?.sections[toSectionIndex]?.children || [];
        if (componnetType === 'custom') {
          const newItem = bizComponents?.normalSection?.children?.find(
            (field: IField) => field.field === fieldId,
          );
          if (newItem) {
            if (pageJson) {
              validateNodeId(pageJson?.content);
            }
            newItem.nodeId = getNodeIdKey();
            newList.splice(toFieldIndex, 0, newItem);
          }
        } else if (componnetType === 'magic') {
          const newSection = bizComponents?.magicSections.find(
            (section: ISection) => section?.children?.[0].field === fieldId,
          );
          console.log({ newSection });
          if (pageJson) {
            validateNodeId(pageJson?.content);
          }
          newSection?.children?.forEach((field: IField) => {
            field.nodeId = getNodeIdKey();
          });
          newList.splice(toFieldIndex, 0, ...(newSection?.children || []));
        }
      }
      break;

    case SCHEMA_ACTION.ADD_SECTION:
      {
        const addSectionPayload = action.payload;

        let { newSectionIndex } = addSectionPayload.data;
        const { bizType, bizKey } = addSectionPayload.data;

        if (editorType === EDITOR_TYPE.BIZ_GROUP && newSectionIndex <= 1) {
          newSectionIndex = 1;
        }

        if (bizType === 'magic') {
          const schemaJson = initBizMagicComponentSchema(
            bizKey as MAGIC_ITEM_TYPE,
            json?.content,
          );
          json?.content?.body?.sections.splice(newSectionIndex, 0, schemaJson);
        } else {
          json?.content?.body?.sections.splice(
            newSectionIndex,
            0,
            generatorBizSectionDefaultSchema(json.content),
          );
        }
      }
      break;

    case SCHEMA_ACTION.DELETE_BY_NODEID:
      {
        const { nodeId } = action.payload;
        const current = getCurrentTargetById(json.content, nodeId);
        const field = (current?.current as IField)?.field || '';
        const fieldsNodeIds = getRelationFieldIds(json.content, nodeId, field);
        const eleLength = fieldsNodeIds.length;
        if (eleLength) {
          if (editorType === EDITOR_TYPE.BIZ_GROUP) {
            Modal.confirm({
              okText: 'Confirm',
              title: 'warning',
              content: `${eleLength} element${
                eleLength > 1 ? 's' : ''
              } relationed by this element, Please confirm whether to delete all?`,
              onOk: () => {
                removeTargetByIds(json.content, [
                  nodeId,
                  (current?.parent as ISection).nodeId || '',
                  ...fieldsNodeIds,
                ]);
                setPageJson(json);
              },
            });
          } else {
            Modal.confirm({
              okText: 'Confirm',
              title: 'warning',
              content: `${eleLength} element${
                eleLength > 1 ? 's' : ''
              } relationed by this element, confirm to delete this element?`,
              onOk: () => {
                removeTargetByIds(json.content, [nodeId]);
                setPageJson(json);
              },
            });
          }
          return;
        } else {
          removeTargetByIds(json.content, [nodeId]);
        }
      }
      break;

    case SCHEMA_ACTION.MOVE_DOWN:
      {
        const { nodeId } = action.payload;
        moveDownByNodeId(json.content, nodeId);
      }
      break;

    case SCHEMA_ACTION.MOVE_UP:
      {
        const { nodeId } = action.payload;
        moveUpByNodeId(json.content, nodeId);
      }
      break;

    case SCHEMA_ACTION.UPDATE_JSON:
      const updateJsonPayload = action.payload;
      json = updateJsonPayload.data;
      break;

    case SCHEMA_ACTION.EXCHANGE_FIELD:
      {
        let {
          data: { oldSectionIndex, newSectionIndex },
        } = action.payload;
        const {
          data: { oldFieldIndex, newFieldIndex },
        } = action.payload;

        const sections = json?.content?.body?.sections;

        if (oldSectionIndex === newSectionIndex) {
          newSectionIndex = Number(newSectionIndex);
          const list = sections[newSectionIndex]?.children;
          const oldItem = list?.splice(oldFieldIndex, 1);
          if (oldItem?.length) {
            list?.splice(newFieldIndex, 0, oldItem[0]);
          }
        } else {
          oldSectionIndex = Number(oldSectionIndex);
          newSectionIndex = Number(newSectionIndex);
          const oldList = sections[oldSectionIndex]?.children;
          const newList = sections[newSectionIndex]?.children;
          newList?.splice(newFieldIndex, 0, oldList?.[oldFieldIndex]);
          oldList?.splice(oldFieldIndex, 1);
        }
      }
      break;

    case SCHEMA_ACTION.EXCHANGE_SECTION:
      const {
        data: { oldSectionIndex, newSectionIndex },
      } = action.payload;
      const oldItem = json?.content?.body?.sections.splice(oldSectionIndex, 1);
      json?.content?.body?.sections.splice(newSectionIndex, 0, oldItem[0]);
      break;

    case SCHEMA_ACTION.UPDTAE_FIELD_BY_NODEID:
      {
        const { nodeId, data } = action.payload;
        console.log({ nodeId, data });
        json.content = updateCurrentTagretFieldById(
          json?.content,
          nodeId,
          data.field,
          data.data,
        );
      }
      break;

    case SCHEMA_ACTION.UPDATE_PAGE_JSON:
      {
        const { data } = action.payload;
        updatePageJsonItem(json, data.field, data.data);
      }
      break;

    default:
      break;
  }
  if (JSON.stringify(json) === JSON.stringify(pageJson)) {
    return;
  }
  console.log(' new json! ', json);
  updateEffects(json);
  setPageJson(json);
};
