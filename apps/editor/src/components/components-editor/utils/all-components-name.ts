import { FORM_ITEM_TYPE } from '@m4b-design/pearl-schema-form';

export const allComponentNames: string[] = [
  FORM_ITEM_TYPE.INPUT,
  FORM_ITEM_TYPE.SELECT,
  FORM_ITEM_TYPE.RADIO,
  FORM_ITEM_TYPE.FILE_UPLOAD,
  FORM_ITEM_TYPE.IMAGE_UPLOAD,
  FORM_ITEM_TYPE.TEXT_AREA,
  FORM_ITEM_TYPE.DATE_PICKER,
  FORM_ITEM_TYPE.DATE_RANGE_PICKER,
  FORM_ITEM_TYPE.BUTTON,
];

export enum MAGIC_ITEM_TYPE {
  VISIBLE = 'visible',
  DISABLED = 'disabled',
}

export const allMagicComponentNames: string[] = [
  MAGIC_ITEM_TYPE.VISIBLE,
  MAGIC_ITEM_TYPE.DISABLED,
];
