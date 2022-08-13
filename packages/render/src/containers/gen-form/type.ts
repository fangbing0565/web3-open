import { ButtonProps, FormInstance, RulesProps } from '@arco-design/web-react';
import { ColProps, GridRowGutter } from '@arco-design/web-react/es/Grid/interface';
import { FormButtonProps, SchemaFormProps } from '@m4b-design/pearl-schema-form';
import { SectionProps } from '@m4b-design/pearl-section';
import { CSSProperties } from 'react';
import { KeyType } from './componnets/body';

export interface GenFormProps<
FormData = any,
FieldValue = FormData[keyof FormData],
FieldKey extends KeyType = keyof FormData,
>  {
  /**
   * @zh Form json
   * @en json
   *  */
  json: IPage;
  /**
   * @zh 表单 values
   * @en formValues
   *  */
  formValues?: FormValue[];
  /**
   * @zh For components that depend on business data，Support direct incoming on the business side，Prioritize replacement of original components
   * @en componentsMap
   *  */
  componentsMap?: Record<string, any>;
  /**
   * @zh options 数据源
   * @en optionsMap
   *  */
  optionsMap?: Record<string, any>;
  /**
   * @zh Commit function
   * @en submitFetcher
   *  */
  submitFetcher?: (query: FormValue[]) => Promise<any>;
  /**
   * @zh 当前步骤
   * @en currStep
   *  */
  currStep?: number | string;
    /**
   * @zh 是否展示提交
   * @en showSubmit
   *  */
  showSubmit?: boolean;
  /**
    * @zh section Layout spacing between
    * @en gutter
    *  */
  gutter?: GridRowGutter | Array<GridRowGutter>;
  /**
    * @zh section Style
    * @en sectionStyle
    *  */
  sectionStyle?: CSSProperties;
  /**
    * @zh A collection of multiple sets of forms
    * @en sections
    *  */
  sections?: SectionProps[];
    /**
  * @zh 表单change事件
  * @en onValuesChange
  *  */
  onValuesChange?: ({value,values,formRef}:{value?: Partial<FormData>, values?: Partial<FormData>, formRef?: FormInstance<FormData, FieldValue, FieldKey>}) => void;
  /**
    * @zh Form submission event
    * @en onSubmit
    *  */
  onSubmit?: (values: FormData) => Promise<any>;
  /**
    * @zh Form reset event
    * @en onReset
    *  */
  onReset?: (values: Record<string, any>) => Promise<any>;
  /**
    * @zh Button related Props
    * @en buttonProps
    */
  buttonProps?: FormButtonProps;
  /**
    * @zh form
    * @en form
    */
  form?: FormInstance<FormData, FieldValue, FieldKey>;
  /**
   * @zh 全局入参
   * @en globalProps
   */
  globalProps?: GlobalProps;
}

export type GlobalProps = {
  locale?: string
}


export type IRulesProps = Omit<RulesProps,'validator'> & {
  validator?: string;
}

export enum FormValueType {
  SELECT = 1,
  INPUT = 2,
  INPUT_GROUP = 3,
  INPUT_SEARCH = 4,
  TEXT_AREA = 5,
  INPUT_NUMBER = 6,
  DATE_PICKER = 7,
  DATE_PICKER_I18N = 8,
  DATE_MONTH_PICKER = 9,
  DATE_YEAR_PICKER = 10,
  DATE_WEEK_PICKER = 11,
  DATE_RANGE_PICKER = 12,
  DATE_RANGE_PICKER_I18N = 13,
  TIME_PICKER = 14,
  TIME_RANGE_PICKER = 15,
  AUTO_COMPLETE = 16,
  CHECKBOX = 17,
  RADIO = 18,
  RATE = 19,
  SWITCH = 20,
  TREE_SELECT = 21,
  CASCADER = 22,
  SLIDER = 23,
  UPLOAD = 24,
  BUTTON = 25,
  SPACE = 26,
  INPUT_TAG = 27,
  SECTION = 28,
  IMAGE_UPLOAD = 29,
  FILE_UPLOAD = 30,
  GROUP = 31,
}


export interface FormValue {
  key: string;
  value?: string;
  not_editable?: boolean;
  type?: FormValueType;
  extra?: string;
}

export type IRule = Omit<RulesProps, 'validator'> &  {
  validator?: string;
}

export interface IField {
  nodeId: string;
  field: string;
  bizType: number;
  type: string;
  label?: string;
  visible?: string;
  disabled?: string;
  effect?: string;
  rules?: IRule[];
  customProps?: Record<string, any>;
  information?: string;
}

// TODO 不存在时候 样式有问题
export type ISection = Partial<SectionProps> & Partial<SchemaFormProps> &  {
  nodeId?: string;
  layout?: "vertical" | "horizontal" | "inline" | "pearl";
  type: 'section';
  children?: IField[];
  visible?: string;
}

export interface IBody {
      /**
     * @zh 表单 items row 的 index
     * @en dataBizSectionIndex
     *  */
      sections: ISection[];
      /**
     * @zh 表单 items row 的 index
     * @en dataBizSectionIndex
     *  */
     dataBizSectionIndex?: string;
     /**
      * @zh 表单 items row 的 className
      * @en formRowClassName
      *  */
     formRowClassName?: string;
     /**
      * @zh 表单项之间的布局间距
      * @en gutter
      *  */
     gutter?: GridRowGutter | Array<GridRowGutter>;
     /**
      * @zh 表单自定义布局样式
      * @en formLayoutStyle
      *  */
     formLayoutStyle?: string;
     /**
      * @zh 整体控制 Col 布局样式，可被 item.colSpan 覆盖
      * @en colSpan
      * @defaultValue {span: 8,style: {padding: '0 8px',}}
      *  */
     colSpan?: ColProps;
     /**
      * @zh 表单重置事件
      * @en onReset
      *  */
     onReset?: string;
     /**
      * @zh 表单change事件
      * @en onValuesChange
      *  */
     onValuesChange?: string;
     /**
      * @zh collapsedFields里面的的表单项会被折叠起来，优先级高于 expandFields
      * @en collapsedFields
      *  */
     collapsedFields?: string[];
     /**
      * @zh expandFields里面的表单项是展开的，优先级低于 collapsedFields
      * @en expandFields
      *  */
     expandFields?: string[];
     /**
      * @zh 是否允许这点元素渲染，不渲染就没有该 Field
      * @en enableCollapsedFieldsRender
      * @defaultValue true
      *  */
     enableCollapsedFieldsRender?: boolean;
     /**
      * @zh change 触发 submit，优先级低于 fieldProps submitWhenChange
      * @en submitWhenChange
      *  */
     submitWhenChange?: boolean;
     /**
      * @zh 模式：搜搜 | 录入
      * @en mode
      */
     mode?: 'search' | 'enter';
      /**
      * @zh 编辑器使用 edit 模式 预览和实际使用用 view 默认是 view
      * @en editorMode
      */
     editorMode?: 'view' | 'edit' | 'disabled';
}

export interface IFormPage {
  header?: {
    title?:string
  };
  body: IBody;
  footer?: {
    title?:string
  };
}
export interface IPage {
  id?: string;
  name?: string;
  version?: string;
  page_type?: 'pageTable' | 'formPage' | 'setpFormPage';
  description?: string;
  content: IFormPage;
  biz_component_group_ids?: Array<string>;// 关联
  key?: string;
  sdk_version?: string;
  sdk_url?: string;
  creator?: string;
  update_time?: string;
  preview_urls?: Array<string>; // 多张预览图
  page_options?: string;
}
