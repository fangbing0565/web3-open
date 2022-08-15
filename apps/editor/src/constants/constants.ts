export enum CategoryStatus {
    ACTIVE = 1,
    SELLER_DEACTIVE = 2,
    DEACTIVE = 3,
    DELETED = 4,
    NON_LINE = 5,
  }
  
  export enum CategoryStatusName {
    ACTIVE = 'Online',
    SELLER_DEACTIVE = 'Restricted',
    DEACTIVE = 'Non-Online',
    DELETED = 'Deleted',
    NON_LINE = 'Non-Online',
  }
  
  export enum PathScope {
    product = '/partner/management',
    category = '/partner/category',
    categoryRule = '/partner/category-rule',
    brandManagement = '/partner/brand',
  }
  
  export enum PRODUCT_STATUS {
    UNDEFINED = 0,
    ALL = 1,
    LIVE = 2,
    QC_PENDING = 3,
    QC_FAILED = 4,
    SELLER_DEACTIVATE = 5,
    PLATFORM_DEACTIVATE = 6,
    DRAFT = 7,
    OUT_OF_STOCK = 8,
    FREEZE = 9,
    DELETED = 10,
  }
  
  export const PRODUCT_STATUS_NAMES: Record<number | string, string> = {
    [PRODUCT_STATUS.LIVE]: 'LIVE',
    [PRODUCT_STATUS.QC_PENDING]: 'QC PENDING',
    [PRODUCT_STATUS.QC_FAILED]: 'QC FAILED',
    [PRODUCT_STATUS.SELLER_DEACTIVATE]: 'SELLER DEACTIVATE',
    [PRODUCT_STATUS.PLATFORM_DEACTIVATE]: 'PLATFORM DEACTIVATE',
    [PRODUCT_STATUS.DRAFT]: 'DRAFT',
    [PRODUCT_STATUS.OUT_OF_STOCK]: 'OUT OF STOCK',
    [PRODUCT_STATUS.FREEZE]: 'FREEZE',
    [PRODUCT_STATUS.DELETED]: 'DELETED',
  };
  
  export const CROSS_BORDER_MAP: Record<number | string, string> = {
    0: 'Local',
    1: 'Crossborder',
  };
  
  export const CB_OVERSEAS_WAREHOUSE_MAP: Record<number | string, string> = {
    1: 'ALL',
    2: 'Yes',
    3: 'No',
  };
  export enum TAG_STATUS {
    UNSPECIFIED_STATUS = 0,
    EFFECTIVE = 1,
    INVALID = 2,
  }
  export const TAG_STATUS_NAME: Record<number | string, string> = {
    [TAG_STATUS.UNSPECIFIED_STATUS]: 'All',
    [TAG_STATUS.EFFECTIVE]: 'Effective',
    [TAG_STATUS.INVALID]: 'Invalid',
  };
  
  export enum TAG_TYPE {
    UNSPECIFIED_BIZ_TYPE = 0,
    OPERATION = 1,
    LOGISTICS = 2,
    GOVERNANCE = 3,
    PROMOTION = 4,
    USER_GROWTH = 5,
    STRATEGY = 6,
    OTHERS = 63,
  }
  export const TAG_TYPE_NAME: Record<number | string, string> = {
    [TAG_TYPE.UNSPECIFIED_BIZ_TYPE]: 'All',
    [TAG_TYPE.OPERATION]: 'Operation',
    [TAG_TYPE.LOGISTICS]: 'Logistics',
    [TAG_TYPE.GOVERNANCE]: 'Governance',
    [TAG_TYPE.PROMOTION]: 'Promotion',
    [TAG_TYPE.USER_GROWTH]: 'User Growth',
    [TAG_TYPE.STRATEGY]: 'Strategy',
    [TAG_TYPE.OTHERS]: 'Others',
  };
  
  export enum CREATE_TYPE {
    UNSPECIFIED_CREATE_TYPE = 0,
    MANUAL = 1,
    AUTO = 2,
  }
  export const CREATE_TYPE_NAME: Record<number | string, string> = {
    [CREATE_TYPE.UNSPECIFIED_CREATE_TYPE]: 'All',
    [CREATE_TYPE.MANUAL]: 'Manual',
    [CREATE_TYPE.AUTO]: 'Auto',
  };
  interface StatusValue {
    value: number | string;
    label: string;
    child?: string[];
  }
  export const PRODUCT_STATUS_NAMES_MAP: Record<string, StatusValue> = {
    All: {
      value: PRODUCT_STATUS.ALL,
      label: 'All',
    },
    Live: {
      value: 'Live',
      label: 'Live',
      child: ['Live', 'OutOfStock'],
    },
  
    SellerDeactivate: {
      value: PRODUCT_STATUS.SELLER_DEACTIVATE,
      label: 'Seller Deactivated',
    },
    Suspended: {
      value: 'Suspended',
      label: 'Suspended',
      child: ['QCPending', 'QCFaild', 'PlatformDeactivated', 'Frozen'],
    },
  
    Draft: {
      value: PRODUCT_STATUS.DRAFT,
      label: 'Draft',
    },
    Deleted: {
      value: PRODUCT_STATUS.DELETED,
      label: 'Deleted',
    },
  };
  export const PRODUCT_STATUS_NAMES_CHILD_MAP: Record<string, StatusValue> = {
    Live: {
      value: PRODUCT_STATUS.LIVE,
      label: 'Live',
    },
    OutOfStock: {
      value: PRODUCT_STATUS.OUT_OF_STOCK,
      label: 'Out of Stock',
    },
    QCFaild: {
      value: PRODUCT_STATUS.QC_FAILED,
      label: 'QC Failed',
    },
    QCPending: {
      value: PRODUCT_STATUS.QC_PENDING,
      label: 'QC Pending',
    },
    PlatformDeactivated: {
      value: PRODUCT_STATUS.PLATFORM_DEACTIVATE,
      label: 'Platform Deactivated',
    },
    Frozen: {
      value: PRODUCT_STATUS.FREEZE,
      label: 'Frozen',
    },
  };
  
  export const HAS_SIMILAR_INNER_PRODUCT: Record<number | string, string> = {
    1: 'YES',
    0: 'NO',
  };
  
  export const DefaultRegion = IS_FANS ? 'GB' : 'ID';
  