import { CategoryStatus } from '@/api/operation/data/category_rule';

export const CATEGORY_STATUS_MAP: Record<string, string> = {
  [CategoryStatus.CATEGORY_ACTIVE]: 'Active',
  [CategoryStatus.CATEGORY_UNSPECIFIED]: 'UnSpecified',
  [CategoryStatus.CATEGORY_DEACTIVE]: 'Deactive',
  [CategoryStatus.CATEGORY_DELETED]: 'Deleted',
  [CategoryStatus.CATEGORY_OFFLINE]: 'Offline',
  [CategoryStatus.CATEGORY_SELLER_DEACTIVE]: 'Seller Deactive',
};

export const CATEGORY_COLOR_MAP: Record<string, string> = {
  [CategoryStatus.CATEGORY_ACTIVE]: 'Green',
  [CategoryStatus.CATEGORY_UNSPECIFIED]: 'Blue',
  [CategoryStatus.CATEGORY_DEACTIVE]: 'Red',
  [CategoryStatus.CATEGORY_DELETED]: 'Red',
  [CategoryStatus.CATEGORY_OFFLINE]: 'Orange',
  [CategoryStatus.CATEGORY_SELLER_DEACTIVE]: 'Red',
};
