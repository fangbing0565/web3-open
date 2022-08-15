import { BizTypeItem } from '@/utils/fetch-biz-type';
import {
  SchemaFormOption,
  FORM_ITEM_TYPE,
} from '@m4b-design/pearl-schema-form';
import { DefaultColSpan } from '../constants';

export const getOptions = (bizTypeList: BizTypeItem[]): SchemaFormOption[] => {
  const list = bizTypeList.map(i => ({
    label: i.biz_type_label,
    value: i.biz_type_id,
  }));
  return [
    {
      label: 'BizComponets Id',
      type: FORM_ITEM_TYPE.INPUT,
      field: 'id',
      customProps: {
        placeholder: 'Please input a BizComponets Id',
      },
      colSpan: DefaultColSpan,
      submitWhenChange: false,
    },
    {
      label: 'BizComponets Name',
      type: FORM_ITEM_TYPE.INPUT,
      field: 'name',
      customProps: {
        placeholder: 'Please input a BizComponets Name',
      },
      colSpan: DefaultColSpan,
      submitWhenChange: false,
    },
    {
      label: 'BizType',
      type: FORM_ITEM_TYPE.SELECT,
      field: 'biz_type',
      colSpan: DefaultColSpan,
      submitWhenChange: false,
      customProps: {
        placeholder: 'Please input a BizType',
        options: list,
        className: 'treeSelect',
      },
    },
  ];
};
