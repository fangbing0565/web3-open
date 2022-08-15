export const BIZ_PATH_LIST = {
    bizComponentsListPath: '/partner/biz-components',
    bizComponentPreviewPath: '/partner/biz-components/preview/',
    bizComponentEditPath: '/partner/biz-components/edit/',
  };
  
  export const BIZ_PATH = {
    bizComponentsList: {
      path: BIZ_PATH_LIST.bizComponentsListPath,
      name: 'Biz Components List',
    },
    bizComponentPreview: {
      path: `${BIZ_PATH_LIST.bizComponentPreviewPath}:id`,
      name: 'Preview Biz Component',
    },
    bizComponentEdit: {
      path: `${BIZ_PATH_LIST.bizComponentEditPath}:id`,
      name: 'Preview Biz Component',
    },
  };
  