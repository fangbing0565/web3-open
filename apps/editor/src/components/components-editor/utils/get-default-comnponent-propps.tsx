import { FORM_ITEM_TYPE } from '@m4b-design/pearl-schema-form';
import { IFormPage, IField, ISection } from '@oec-open/ttspc-render';
import { MAGIC_ITEM_TYPE } from './all-components-name';

let fieldKey = 1;
let nodeIdKey = 1;

const LABEL = 'label';
const PLACEHOLDER = 'placeholder';

export const validateNodeId = (schemaJson: IFormPage) => {
  const isFindId = schemaJson?.body?.sections.find(section => {
    if (section?.nodeId === `node_${nodeIdKey}`) {
      nodeIdKey++;
      return true;
    }
    return section?.children?.find((field: IField) => {
      if (field?.field === `field_${fieldKey}`) {
        fieldKey++;
        return true;
      }
      if (field?.nodeId === `node_${nodeIdKey}`) {
        nodeIdKey++;
        return true;
      }
      return false;
    });
  });
  if (isFindId) {
    validateNodeId(schemaJson);
  }
};

const getFieldKey = () => `field_${fieldKey++}`;
export const getNodeIdKey = () => `node_${nodeIdKey++}`;

export const getBizSelectDefaultSchema: (
  key?: string | FORM_ITEM_TYPE,
) => IField[] = key => [
  {
    type: FORM_ITEM_TYPE.SELECT,
    field: key || getFieldKey(),
    nodeId: key || getNodeIdKey(),
    bizType: 0,
    label: LABEL,
    customProps: {
      placeholder: PLACEHOLDER,
      options: [
        {
          label: 'label',
          value: 'value',
          key: 'key',
        },
      ],
    },
  },
];

export const getBizInputDefaultSchema: (
  key?: string | FORM_ITEM_TYPE,
) => IField[] = key => [
  {
    type: FORM_ITEM_TYPE.INPUT,
    field: key || getFieldKey(),
    nodeId: key || getNodeIdKey(),
    bizType: 0,
    label: LABEL,
    customProps: {
      placeholder: PLACEHOLDER,
    },
  },
];

export const getBizTextAreaDefaultSchema: (
  key?: string | FORM_ITEM_TYPE,
) => IField[] = key => [
  {
    type: FORM_ITEM_TYPE.TEXT_AREA,
    field: key || getFieldKey(),
    nodeId: key || getNodeIdKey(),
    bizType: 0,
    label: LABEL,
    customProps: {
      placeholder: PLACEHOLDER,
    },
  },
];

export const getBizRadioDefaultSchema: (
  key?: string | FORM_ITEM_TYPE,
) => IField[] = key => [
  {
    type: FORM_ITEM_TYPE.RADIO,
    field: key || getFieldKey(),
    nodeId: key || getNodeIdKey(),
    bizType: 0,
    label: LABEL,
    customProps: {
      options: [
        {
          label: 'male',
          value: 'male',
          key: 'male',
        },
        {
          label: 'female',
          value: 'female',
          key: 'female',
        },
      ],
    },
  },
];

export const getBizFileUploadDefaultSchema: (
  key?: string | FORM_ITEM_TYPE,
) => IField[] = key => [
  {
    type: FORM_ITEM_TYPE.FILE_UPLOAD,
    field: key || getFieldKey(),
    nodeId: key || getNodeIdKey(),
    bizType: 0,
    label: LABEL,
  },
];

export const getBizButtonDefaultSchema: (
  key?: string | FORM_ITEM_TYPE,
) => IField[] = key => [
  {
    type: FORM_ITEM_TYPE.BUTTON,
    field: key || getFieldKey(),
    nodeId: key || getNodeIdKey(),
    bizType: 0,
    label: LABEL,
    buttonType: 'button',
    customProps: {
      type: 'primary',
      style: {
        width: '120px',
      },
    },
  },
];

export const getBizImageUploadDefaultSchema: (
  key?: string | FORM_ITEM_TYPE,
) => IField[] = key => [
  {
    type: FORM_ITEM_TYPE.IMAGE_UPLOAD,
    field: key || getFieldKey(),
    nodeId: key || getNodeIdKey(),
    bizType: 0,
    label: LABEL,
  },
];

export const getBizDatePickerDefaultSchema: (
  key?: string | FORM_ITEM_TYPE,
) => IField[] = key => [
  {
    type: FORM_ITEM_TYPE.DATE_PICKER,
    field: key || getFieldKey(),
    nodeId: key || getNodeIdKey(),
    bizType: 0,
    label: LABEL,
    customProps: {
      placeholder: 'please select date',
    },
  },
];

export const getBizDateRangePickerDefaultSchema: (
  key?: string | FORM_ITEM_TYPE,
) => IField[] = key => [
  {
    type: FORM_ITEM_TYPE.DATE_RANGE_PICKER,
    field: key || getFieldKey(),
    nodeId: key || getNodeIdKey(),
    bizType: 0,
    label: LABEL,
    customProps: {
      placeholder: ['start time', 'end time'],
    },
  },
];

export const getBizDisabledDefaultSchema: (
  key?: string | FORM_ITEM_TYPE,
) => ISection = key => {
  const field1 = getBizInputDefaultSchema(key ? `${key}_1` : key)?.[0];
  const field2 = getBizInputDefaultSchema(key ? `${key}_2` : key)?.[0];
  return {
    type: FORM_ITEM_TYPE.SECTION,
    title: 'Disabled Relation',
    layout: 'vertical',
    mode: 'search',
    colSpan: {
      span: 24,
    },
    nodeId: getNodeIdKey(),
    children: [
      {
        ...field1,
      },
      {
        ...field2,
        disabled: `({values})=>!values.${field1.field}`,
      },
    ],
  };
};

export const getBizVisibleDefaultSchema: (
  key?: string | FORM_ITEM_TYPE,
) => ISection = key => {
  const field1 = getBizInputDefaultSchema(key ? `${key}_1` : key)?.[0];
  const field2 = getBizInputDefaultSchema(key ? `${key}_2` : key)?.[0];
  return {
    type: FORM_ITEM_TYPE.SECTION,
    title: 'Visible Relation',
    layout: 'vertical',
    mode: 'search',
    colSpan: {
      span: 24,
    },
    nodeId: getNodeIdKey(),
    children: [
      {
        ...field1,
      },
      {
        ...field2,
        visible: `({values})=>values.${field1.field}`,
      },
    ],
  };
};

export const generatorBizSectionDefaultSchema = (
  schemaJson: IFormPage,
): ISection => {
  validateNodeId(schemaJson);
  return {
    type: FORM_ITEM_TYPE.SECTION,
    title: 'Section Title',
    layout: 'vertical',
    mode: 'search',
    colSpan: {
      span: 24,
    },
    nodeId: getNodeIdKey(),
    children: [],
  };
};

export function initBizComponentDefaultSchema(
  componentKey: FORM_ITEM_TYPE,
  schemaJson?: IFormPage,
): IField[] {
  if (schemaJson) {
    validateNodeId(schemaJson);
  }
  const key = schemaJson ? '' : componentKey;
  switch (componentKey) {
    case FORM_ITEM_TYPE.DATE_RANGE_PICKER:
      return getBizDateRangePickerDefaultSchema(key);
    case FORM_ITEM_TYPE.DATE_PICKER:
      return getBizDatePickerDefaultSchema(key);
    case FORM_ITEM_TYPE.TEXT_AREA:
      return getBizTextAreaDefaultSchema(key);
    case FORM_ITEM_TYPE.IMAGE_UPLOAD:
      return getBizImageUploadDefaultSchema(key);
    case FORM_ITEM_TYPE.FILE_UPLOAD:
      return getBizFileUploadDefaultSchema(key);
    case FORM_ITEM_TYPE.BUTTON:
      return getBizButtonDefaultSchema(key);
    case FORM_ITEM_TYPE.RADIO:
      return getBizRadioDefaultSchema(key);
    case FORM_ITEM_TYPE.SELECT:
      return getBizSelectDefaultSchema(key);
    case FORM_ITEM_TYPE.INPUT:
    default:
      return getBizInputDefaultSchema(key);
  }
}

export function initBizMagicComponentSchema(
  componentKey: MAGIC_ITEM_TYPE,
  schemaJson?: IFormPage,
): ISection {
  if (schemaJson) {
    validateNodeId(schemaJson);
  }
  const key = schemaJson ? '' : componentKey;
  switch (componentKey) {
    case MAGIC_ITEM_TYPE.VISIBLE:
      return getBizVisibleDefaultSchema(key);
    case MAGIC_ITEM_TYPE.DISABLED:
    default:
      return getBizDisabledDefaultSchema(key);
  }
}
