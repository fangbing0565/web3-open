import { Message } from '@arco-design/web-react';
import { IField, IFormPage } from '@oec-open/ttspc-render';
import { allComponentNames } from './all-components-name';
import { EditorIPage } from './type';

export function getType(obj: any): string {
  return Object.prototype.toString.call(obj).slice(8, -1);
}
export function hasProp(obj: any, prop: string) {
  return obj.hasOwnProperty(prop);
}

export function validateStr(item: any, key: string) {
  const val: string | { type: 'string'; value: string[] } = item[key];
  if (!hasProp(item, key)) {
    return true;
  }
  if (getType(val) !== 'String' && getType(val) !== 'Object') {
    return true;
  }
  const r =
    getType(val) === 'Object' &&
    ((val as any)?.type !== 'string' || !(val as any)?.value?.length);
  return r;
}

export function captureSchemaJsonError(
  jsonString: string,
  originJson?: EditorIPage,
) {
  const res = {
    error: '',
    data: {} as any,
    success: false,
  };
  try {
    res.data = JSON.parse(jsonString);
  } catch (error) {
    res.error = String(error);
    jsonString.slice(0);
    if (/position[\s]*([\d]*)/.test(res.error)) {
      const preString = jsonString.slice(0, Number(RegExp.$1));
      let line = 1;
      let column = 1;
      for (const preStringItem of preString) {
        column++;
        if (preStringItem === '\n') {
          column = 0;
          line++;
        }
      }
      res.error += `, line ${line}, column ${column}`;
    }
    return res;
  }
  const json = res.data;
  if (getType(json) !== 'Object') {
    res.error = 'missing root, root must be object';
    return res;
  }

  if (getType(json.content) !== 'Object') {
    res.error = 'missing content, json.content must be object';
    return res;
  }

  console.log({ res });

  const body = res.data?.content?.body || {};

  if (getType(body) !== 'Object') {
    res.error = 'missing body, body must be object';
    return res;
  }

  if (hasProp(body, 'gutter') && getType(body.gutter) !== 'Number') {
    res.error = 'body.gutter must be number';
    return res;
  }

  if (hasProp(body, 'sections') && !getType(body.sections !== 'Array')) {
    res.error = 'missing body.sections, body.sections must be array';
    return res;
  }

  const nodeIdMap = new Set();

  for (const i in body.sections) {
    const sectionItem = body.sections[i];
    if (validateStr(sectionItem, 'nodeId')) {
      res.error = `missingsection[${i}].nodeId, section[${i}].nodeId must be string`;
      return res;
    }
    const hasSection = nodeIdMap.has(sectionItem.nodeId);
    if (hasSection) {
      res.error = `the section[${i}].nodeId, ${sectionItem.nodeId} is repeat`;
      return res;
    }
    nodeIdMap.add(sectionItem.nodeId);
    if (validateStr(sectionItem, 'title')) {
      res.error = `the section[${i}].title must be string`;
      return res;
    }
    if (hasProp(sectionItem, 'children')) {
      if (getType(sectionItem.children) !== 'Array') {
        res.error = `the section[${i}].children must be array`;
        return res;
      }
      for (const j in sectionItem.children) {
        const fieldItem = sectionItem.children[j];
        const sectionPosition = `section[${i}].children[${j}]`;
        if (validateStr(fieldItem, 'type')) {
          res.error = `missing ${sectionPosition}.type, ${sectionPosition}.type must be string`;
          return res;
        }
        if (!allComponentNames.includes(fieldItem.type)) {
          res.error = `${sectionPosition}.type must in [${allComponentNames.join(
            ', ',
          )}]`;
          return res;
        }
        if (validateStr(fieldItem, 'nodeId')) {
          res.error = `missing ${sectionPosition}.nodeId, ${sectionPosition}.nodeId must be string`;
          return res;
        }
        const hsaNodeId = nodeIdMap.has(fieldItem.nodeId);
        if (hsaNodeId) {
          res.error = `the ${sectionPosition}.nodeId, ${fieldItem.nodeId} is repeat`;
          return res;
        }
        nodeIdMap.add(fieldItem.nodeId);
      }
    }
  }

  if (JSON.stringify(res.data) !== JSON.stringify(originJson)) {
    res.success = true;
    return res;
  }
  return res;
}

export function captureFieldRepeat(
  fieldValue?: string,
  pageJson?: EditorIPage,
) {
  let res: any;
  pageJson?.content.body.sections.find(section =>
    section.children?.find((fieldItem: IField) => {
      if (fieldItem.field === fieldValue) {
        res = fieldItem;
        return true;
      }
      return false;
    }),
  );
  if (res) {
    Message.error(`field has repeat with ${res?.label}, ${res?.field}.`);
  }
  return res;
}
