import { FORM_ITEM_TYPE } from '@m4b-design/pearl-schema-form';
import BizTableRender from './biz-table-render';
import BizValidatorRender from './biz-validator';

export enum BIZ_ITEM_TYPE {
  BIZ_TABLE = 'biz_table',
  BIZ_VALIDATOR = 'biz_validator',
}

enum PROPS_NAME {
  PAGE_PROPS = 'Page props',
  BASIC_PROPS = 'Basic props',
  RELATION_PROPS = 'Relation props',
  CUSTOM_PROPS = 'Custom props',
  OPTIONS_PROPS = 'Options List',
  VALIDATOR_PROPS = 'Validator props',
}

export const bizKey2Render: {
  [key: string]: any;
} = {
  [BIZ_ITEM_TYPE.BIZ_TABLE]: BizTableRender,
  [BIZ_ITEM_TYPE.BIZ_VALIDATOR]: BizValidatorRender,
};

const basePropsMap = {
  fieldProp: {
    type: FORM_ITEM_TYPE.INPUT,
    field: 'field',
    label: 'Field',
    required: true,
    customProps: {
      placeholder: 'enter field',
    },
  },
  labelProp: {
    i18nProps: {
      i18nControl: true,
    },
    type: FORM_ITEM_TYPE.INPUT,
    field: 'label',
    label: 'Label',
    customProps: {
      placeholder: 'enter label',
    },
  },
  informationProp: {
    i18nProps: {
      i18nControl: true,
    },
    type: FORM_ITEM_TYPE.INPUT,
    field: 'information',
    label: 'Information',
    customProps: {
      placeholder: 'enter information',
    },
  },
  titleProp: {
    i18nProps: {
      i18nControl: true,
    },
    type: FORM_ITEM_TYPE.INPUT,
    field: 'title',
    label: 'Title',
    customProps: {
      placeholder: 'enter title',
    },
  },
};

const customPropsMap = {
  placeholaderProp: {
    i18nProps: {
      i18nControl: true,
    },
    type: FORM_ITEM_TYPE.INPUT,
    field: 'customProps.placeholder',
    label: 'placeholder',
    customProps: {
      placeholder: 'enter placeholder',
    },
  },
  maxLengthProp: {
    type: FORM_ITEM_TYPE.INPUT_NUMBER,
    field: 'customProps.maxLength.length',
    label: 'Max length',
    customProps: {
      placeholder: 'enter max length',
      min: 1,
    },
  },
  maxLengthErrorOnlyProp: {
    type: FORM_ITEM_TYPE.RADIO,
    field: 'customProps.maxLength.errorOnly',
    label: 'Max length show error',
    customProps: {
      options: [
        {
          label: 'show error',
          value: true,
        },
        {
          label: 'not show error',
          value: false,
        },
      ],
    },
  },
  showWordLimitProp: {
    type: FORM_ITEM_TYPE.RADIO,
    field: 'customProps.showWordLimit',
    label: 'Show word limit',
    customProps: {
      options: [
        {
          label: 'show',
          value: true,
        },
        {
          label: 'hide',
          value: false,
        },
      ],
    },
  },
  allowClearProp: {
    type: FORM_ITEM_TYPE.RADIO,
    field: 'customProps.allowClear',
    label: 'Allow clear',
    customProps: {
      options: [
        {
          label: 'allow',
          value: true,
        },
        {
          label: 'not allow',
          value: false,
        },
      ],
    },
  },
  notFoundProp: {
    i18nProps: {
      i18nControl: true,
    },
    type: FORM_ITEM_TYPE.INPUT,
    field: 'customProps.notFoundContent',
    label: 'Not found content',
    customProps: {
      placeholder: 'enter not found content',
    },
  },
  triggerProp: {
    type: FORM_ITEM_TYPE.RADIO,
    field: 'customProps.trigger',
    label: 'Trigger',
    customProps: {
      options: [
        {
          label: 'click',
          value: 'click',
        },
        {
          label: 'hover',
          value: 'hover',
        },
      ],
    },
  },
  sectionModeProp: {
    type: FORM_ITEM_TYPE.SELECT,
    field: 'mode',
    label: 'Section Mode',
    customProps: {
      placeholder: 'select mode',
      options: ['search', 'enter'],
    },
  },
  layoutProp: {
    type: FORM_ITEM_TYPE.SELECT,
    field: 'layout',
    label: 'Section layout',
    customProps: {
      placeholder: 'select section layout',
      options: ['vertical', 'horizontal', 'inline', 'pearl'],
    },
  },
  colSpanProp: {
    type: FORM_ITEM_TYPE.SELECT,
    field: 'colSpan.span',
    label: 'col span',
    customProps: {
      placeholder: 'select col span',
      options: [12, 24],
    },
  },
  formatProp: {
    type: FORM_ITEM_TYPE.INPUT,
    field: 'customProps.format',
    label: 'Time format',
    customProps: {
      placeholder: 'enter time format like YYYY-MM-DD',
    },
  },
  dateModeProp: {
    type: FORM_ITEM_TYPE.SELECT,
    field: 'customProps.mode',
    label: 'Date mode',
    customProps: {
      placeholder: 'select date mode',
      options: ['date', 'month', 'week', 'year', 'quarter'],
    },
  },
  placeholaderArrayProp: [
    {
      i18nProps: {
        i18nControl: true,
      },
      type: FORM_ITEM_TYPE.INPUT,
      field: 'customProps.placeholder[0]',
      label: 'Date start placeholader',
      customProps: {
        placeholder: 'enter start placeholader',
      },
    },
    {
      i18nProps: {
        i18nControl: true,
      },
      type: FORM_ITEM_TYPE.INPUT,
      field: 'customProps.placeholder[1]',
      label: 'Date end placeholader',
      customProps: {
        placeholder: 'enter end placeholader',
      },
    },
  ],
  showTimeProp: {
    type: FORM_ITEM_TYPE.RADIO,
    field: 'customProps.showTime',
    label: 'Show time button',
    customProps: {
      options: [
        {
          label: 'show',
          value: true,
        },
        {
          label: 'not show',
          value: false,
        },
      ],
    },
  },
  showNowBtnProp: {
    type: FORM_ITEM_TYPE.RADIO,
    field: 'customProps.showNowBtn',
    label: 'Show now button',
    customProps: {
      options: [
        {
          label: 'show',
          value: true,
        },
        {
          label: 'not show',
          value: false,
        },
      ],
    },
  },
  directionProp: {
    type: FORM_ITEM_TYPE.SELECT,
    field: 'customProps.direction',
    label: 'Radio group direction',
    customProps: {
      options: [
        {
          label: 'vertical',
          value: 'vertical',
        },
        {
          label: 'horizontal',
          value: 'horizontal',
        },
      ],
    },
  },
  uploadListTypeProp: {
    type: FORM_ITEM_TYPE.SELECT,
    field: 'customProps.listType',
    label: 'Upload list type',
    customProps: {
      options: ['text', 'picture-list', 'picture-card'],
    },
  },
  showUploadListProp: {
    type: FORM_ITEM_TYPE.RADIO,
    field: 'customProps.showUploadList',
    label: 'Upload list type',
    customProps: {
      options: [
        {
          label: 'show',
          value: true,
        },
        {
          label: 'not show',
          value: false,
        },
      ],
    },
  },
  fileCountLimitProp: {
    type: FORM_ITEM_TYPE.INPUT_NUMBER,
    field: 'customProps.limit',
    label: 'Upload file count limit',
    customProps: {
      min: 1,
      placeholder: 'enter upload file count limit',
    },
  },
  uploadTipProp: {
    i18nProps: {
      i18nControl: true,
    },
    type: FORM_ITEM_TYPE.INPUT,
    field: 'customProps.tip',
    label: 'Upload tip',
    customProps: {
      placeholder: 'enter upload tip',
    },
  },
  uploadDirectoryProp: {
    type: FORM_ITEM_TYPE.RADIO,
    field: 'customProps.directory',
    label: 'Upload with directory',
    customProps: {
      options: [
        {
          label: 'directory',
          value: true,
        },
        {
          label: 'file',
          value: false,
        },
      ],
    },
  },
  minRowsProp: {
    type: FORM_ITEM_TYPE.INPUT_NUMBER,
    field: 'customProps.autoSize.minRows',
    label: 'Min rows',
    customProps: {
      min: 1,
    },
  },
  maxRowsProp: {
    type: FORM_ITEM_TYPE.INPUT_NUMBER,
    field: 'customProps.autoSize.maxRows',
    label: 'Max rows',
    customProps: {
      min: 1,
    },
  },
  buttonTextProp: {
    i18nProps: {
      i18nControl: true,
    },
    type: FORM_ITEM_TYPE.INPUT,
    field: 'text',
    label: 'Button text',
    customProps: {
      placeholader: 'enter button text',
    },
  },
  buttonStatusProp: {
    type: FORM_ITEM_TYPE.SELECT,
    field: 'customProps.status',
    label: 'Button status',
    customProps: {
      options: ['warning', 'danger', 'success', 'default'],
    },
  },
  buttonTypeProp: {
    type: FORM_ITEM_TYPE.SELECT,
    field: 'customProps.type',
    label: 'Button type',
    customProps: {
      options: ['default', 'primary', 'secondary', 'dashed', 'text', 'outline'],
    },
  },
};

const baseSectionGroup = {
  title: PROPS_NAME.BASIC_PROPS,
  type: FORM_ITEM_TYPE.SECTION,
  layout: 'vertical',
  colSpan: {
    span: 24,
  },
  children: [
    basePropsMap.fieldProp,
    basePropsMap.labelProp,
    basePropsMap.informationProp,
    customPropsMap.colSpanProp,
  ],
};

const relationPropsMap = {
  visibleProp: {
    type: FORM_ITEM_TYPE.SELECT,
    field: 'visible',
    label: 'Relation visible',
    customProps: {
      defaultValue: undefined,
      allowClear: true,
      optionsType: 'allFields',
      placeholder: 'select relation filed to visible current field',
      setValue: {
        value: `({values})=>values.__value__`,
      },
    },
  },
  disabledProp: {
    type: FORM_ITEM_TYPE.SELECT,
    field: 'disabled',
    label: 'Relation disabled',
    customProps: {
      defaultValue: undefined,
      allowClear: true,
      placeholder: 'select relation filed to disabled current field',
      optionsType: 'allFields',
      setValue: {
        value: `({values})=>values.__value__`,
      },
    },
  },
};

const relationSectionGroup = {
  title: PROPS_NAME.RELATION_PROPS,
  type: FORM_ITEM_TYPE.SECTION,
  layout: 'vertical',
  colSpan: {
    span: 24,
  },
  children: [relationPropsMap.visibleProp, relationPropsMap.disabledProp],
};

const optionsPropsMap = {
  // {
  //   type: BIZ_ITEM_TYPE.BIZ_TABLE,
  //   field: 'customProps.options',
  //   label: 'Default options',
  //   customProps: {
  //     optionsList: ['label', 'value', 'key'],
  //   },
  // },
  optionsProp: {
    type: BIZ_ITEM_TYPE.BIZ_TABLE,
    field: 'customProps.options',
    label: 'Default options',
    // customProps: {
    //   optionsList: ['label', 'value', 'key'],
    // },
  },
};

const optionsSectionGroup = {
  title: PROPS_NAME.OPTIONS_PROPS,
  type: FORM_ITEM_TYPE.SECTION,
  layout: 'vertical',
  colSpan: {
    span: 24,
  },
  children: [optionsPropsMap.optionsProp],
};

const validatorSectionGroup = {
  title: PROPS_NAME.VALIDATOR_PROPS,
  tye: FORM_ITEM_TYPE.SECTION,
  layout: 'vertical',
  colSpan: {
    span: 24,
  },
  children: [
    {
      type: FORM_ITEM_TYPE.RADIO,
      field: 'customProps.validatorRules.required',
      label: 'Is required',
      customProps: {
        options: [
          {
            label: 'required',
            value: true,
            key: 'required',
          },
          {
            label: 'not required',
            value: false,
            key: 'required',
          },
        ],
      },
    },
    {
      type: FORM_ITEM_TYPE.INPUT,
      field: 'customProps.validatorRules.requiredText',
      label: 'Required text',
      i18nProps: {
        i18nControl: true,
      },
      customProps: {
        placeholader: 'enter required text.',
      },
    },
    {
      type: BIZ_ITEM_TYPE.BIZ_VALIDATOR,
      field: 'customProps.validatorRules.rules',
      label: 'Validator control',
      customProps: {
        valueType: 'string',
      },
    },
  ],
};

export const componentDefaultProps: {
  [key: string]: { [key: string]: any }[];
} = {
  [FORM_ITEM_TYPE.INPUT]: [
    baseSectionGroup,
    {
      title: PROPS_NAME.CUSTOM_PROPS,
      type: FORM_ITEM_TYPE.SECTION,
      layout: 'vertical',
      colSpan: {
        span: 24,
      },
      children: [
        customPropsMap.placeholaderProp,
        customPropsMap.maxLengthProp,
        customPropsMap.maxLengthErrorOnlyProp,
        customPropsMap.showWordLimitProp,
        customPropsMap.allowClearProp,
      ],
    },
    validatorSectionGroup,
    // {
    //   title: PROPS_NAME.VALIDATOR_PROPS,
    //   tye: FORM_ITEM_TYPE.SECTION,
    //   layout: 'vertical',
    //   colSpan: {
    //     span: 24,
    //   },
    //   children: [
    //     {
    //       type: BIZ_ITEM_TYPE.BIZ_VALIDATOR,
    //       field: 'customProps.validatorRules',
    //       label: 'Validator control',
    //       customProps: {
    //         valueType: 'string',
    //       },
    //     },
    //   ],
    // },
    relationSectionGroup,
  ],
  [FORM_ITEM_TYPE.SELECT]: [
    baseSectionGroup,
    {
      title: PROPS_NAME.CUSTOM_PROPS,
      type: FORM_ITEM_TYPE.SECTION,
      layout: 'vertical',
      colSpan: {
        span: 24,
      },
      children: [
        customPropsMap.placeholaderProp,
        customPropsMap.notFoundProp,
        customPropsMap.allowClearProp,
        customPropsMap.triggerProp,
      ],
    },
    optionsSectionGroup,
    validatorSectionGroup,
    relationSectionGroup,
  ],
  [FORM_ITEM_TYPE.SECTION]: [
    {
      title: PROPS_NAME.BASIC_PROPS,
      type: FORM_ITEM_TYPE.SECTION,
      layout: 'vertical',
      colSpan: {
        span: 24,
      },
      children: [basePropsMap.titleProp],
    },
    {
      title: PROPS_NAME.CUSTOM_PROPS,
      type: FORM_ITEM_TYPE.SECTION,
      layout: 'vertical',
      colSpan: {
        span: 24,
      },
      children: [
        customPropsMap.sectionModeProp,
        customPropsMap.layoutProp,
        customPropsMap.colSpanProp,
      ],
    },
    // {
    //   title: PROPS_NAME.RELATION_PROPS,
    //   type: FORM_ITEM_TYPE.SECTION,
    //   layout: 'vertical',
    //   colSpan: {
    //     span: 24,
    //   },
    //   children: [
    //     {
    //       type: FORM_ITEM_TYPE.SELECT,
    //       field: 'visible',
    //       label: 'Relation visible',
    //       customProps: {
    //         allowClear: true,
    //         optionsType: 'allFields',
    //         placeholder: 'select relation filed to visible current section',
    //         setValueFn: `({values})=>values.__value__`,
    //       },
    //     },
    //   ],
    // },
  ],
  [FORM_ITEM_TYPE.DATE_RANGE_PICKER]: [
    baseSectionGroup,
    {
      title: PROPS_NAME.CUSTOM_PROPS,
      type: FORM_ITEM_TYPE.SECTION,
      layout: 'vertical',
      colSpan: {
        span: 24,
      },
      children: [
        customPropsMap.formatProp,
        customPropsMap.dateModeProp,
        ...customPropsMap.placeholaderArrayProp,
      ],
    },
    validatorSectionGroup,
    relationSectionGroup,
  ],
  [FORM_ITEM_TYPE.DATE_PICKER]: [
    baseSectionGroup,
    {
      title: PROPS_NAME.CUSTOM_PROPS,
      type: FORM_ITEM_TYPE.SECTION,
      layout: 'vertical',
      colSpan: {
        span: 24,
      },
      children: [
        customPropsMap.formatProp,
        customPropsMap.placeholaderProp,
        customPropsMap.allowClearProp,
        customPropsMap.showTimeProp,
        customPropsMap.showNowBtnProp,
      ],
    },
    validatorSectionGroup,
    relationSectionGroup,
  ],
  [FORM_ITEM_TYPE.RADIO]: [
    baseSectionGroup,
    {
      title: PROPS_NAME.CUSTOM_PROPS,
      type: FORM_ITEM_TYPE.SECTION,
      layout: 'vertical',
      colSpan: {
        span: 24,
      },
      children: [customPropsMap.directionProp],
    },
    optionsSectionGroup,
    validatorSectionGroup,
    relationSectionGroup,
  ],
  [FORM_ITEM_TYPE.FILE_UPLOAD]: [
    baseSectionGroup,
    {
      title: PROPS_NAME.CUSTOM_PROPS,
      type: FORM_ITEM_TYPE.SECTION,
      layout: 'vertical',
      colSpan: {
        span: 24,
      },
      children: [
        customPropsMap.uploadDirectoryProp,
        customPropsMap.uploadListTypeProp,
        customPropsMap.showUploadListProp,
        customPropsMap.fileCountLimitProp,
        customPropsMap.uploadTipProp,
      ],
    },
    validatorSectionGroup,
    relationSectionGroup,
  ],
  [FORM_ITEM_TYPE.IMAGE_UPLOAD]: [
    baseSectionGroup,
    {
      title: PROPS_NAME.CUSTOM_PROPS,
      type: FORM_ITEM_TYPE.SECTION,
      layout: 'vertical',
      colSpan: {
        span: 24,
      },
      children: [
        customPropsMap.uploadDirectoryProp,
        customPropsMap.uploadListTypeProp,
        customPropsMap.showUploadListProp,
        customPropsMap.fileCountLimitProp,
        customPropsMap.uploadTipProp,
      ],
    },
    validatorSectionGroup,
    relationSectionGroup,
  ],
  [FORM_ITEM_TYPE.TEXT_AREA]: [
    baseSectionGroup,
    {
      title: PROPS_NAME.CUSTOM_PROPS,
      type: FORM_ITEM_TYPE.SECTION,
      layout: 'vertical',
      colSpan: {
        span: 24,
      },
      children: [
        customPropsMap.placeholaderProp,
        customPropsMap.maxLengthProp,
        customPropsMap.maxLengthErrorOnlyProp,
        customPropsMap.showWordLimitProp,
        customPropsMap.minRowsProp,
        customPropsMap.maxRowsProp,
      ],
    },
    validatorSectionGroup,
    relationSectionGroup,
  ],
  [FORM_ITEM_TYPE.BUTTON]: [
    baseSectionGroup,
    {
      title: PROPS_NAME.CUSTOM_PROPS,
      type: FORM_ITEM_TYPE.SECTION,
      layout: 'vertical',
      colSpan: {
        span: 24,
      },
      children: [
        customPropsMap.buttonTextProp,
        customPropsMap.buttonStatusProp,
        customPropsMap.buttonTypeProp,
      ],
    },
    relationSectionGroup,
  ],
};

export const pageDefaultProps = [
  {
    title: PROPS_NAME.PAGE_PROPS,
    type: FORM_ITEM_TYPE.SECTION,
    layout: 'vertical',
    colSpan: {
      span: 24,
    },
    children: [
      {
        type: FORM_ITEM_TYPE.INPUT,
        field: 'name',
        label: 'Page name',
        required: true,
        customProps: {
          placeholder: 'enter page name',
        },
      },
      {
        type: FORM_ITEM_TYPE.INPUT,
        field: 'description',
        label: 'Page description',
        customProps: {
          placeholder: 'enter page description',
        },
      },
      {
        type: FORM_ITEM_TYPE.INPUT,
        field: 'page_options.i18n_key',
        label: 'Page i18n option key',
        customProps: {
          placeholder: 'enter page i18n key',
        },
      },
      {
        type: FORM_ITEM_TYPE.INPUT,
        field: 'page_options.name_space',
        label: 'Page i18n option name space',
        customProps: {
          placeholder: 'enter page i18n name space',
        },
      },
    ],
  },
];
