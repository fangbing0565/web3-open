import { BizTypeItem } from '@/utils/fetch-biz-type';
import {
  SchemaFormOption,
  FORM_ITEM_TYPE,
} from '@m4b-design/pearl-schema-form';
// import { PageTab } from '../components/page-tab';
import { pageTypeList, DefaultColSpan } from '../constants';

export const getOptions = (bizTypeList: BizTypeItem[]): SchemaFormOption[] => {
  const list = bizTypeList.map(i => ({
    label: i.biz_type_label,
    value: i.biz_type_id,
  }));
  return [
    // {
    //   type: FORM_ITEM_TYPE.FUNCTION,
    //   render: PageTab,
    //   field: 'version',
    //   colSpan: { span: 24 },
    //   submitWhenChange: true,
    // },
    {
      label: 'Page ID',
      type: FORM_ITEM_TYPE.INPUT,
      field: 'id',
      customProps: {
        placeholder: 'Please input a Page ID',
      },
      colSpan: DefaultColSpan,
      submitWhenChange: false,
    },
    {
      label: 'Page Name',
      type: FORM_ITEM_TYPE.INPUT,
      field: 'name',
      customProps: {
        placeholder: 'Please input a Page Name',
      },
      colSpan: DefaultColSpan,
      submitWhenChange: false,
    },
    {
      label: 'Page Key',
      type: FORM_ITEM_TYPE.INPUT,
      field: 'page_code',
      colSpan: DefaultColSpan,
      customProps: {
        placeholder: 'Please input a Page key',
      },
      submitWhenChange: false,
    },
    {
      label: 'Biz Type',
      type: FORM_ITEM_TYPE.SELECT,
      field: 'bizType',
      colSpan: DefaultColSpan,
      submitWhenChange: false,
      customProps: {
        placeholder: 'Please select a Biz Type',
        options: list,
        className: 'treeSelect',
      },
    },
    {
      label: 'Page Type',
      type: FORM_ITEM_TYPE.SELECT,
      field: 'page_type',
      colSpan: DefaultColSpan,
      submitWhenChange: false,
      customProps: {
        placeholder: 'Please select a Page Type',
        options: pageTypeList,
        className: 'treeSelect',
      },
    },
  ];
};
