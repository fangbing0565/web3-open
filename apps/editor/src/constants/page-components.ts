export const PAGE_PATH_LIST = {
    pageComponentsListPath: '/partner/page-components',
    pageComponentPreviewPath: '/partner/page-components/preview/',
    pageComponentEditPath: '/partner/page-components/edit/',
  };
  
  export const PAGE_PATH = {
    pageComponentsList: {
      path: PAGE_PATH_LIST.pageComponentsListPath,
      name: 'Page Components List',
    },
    pageComponentPreview: {
      path: `${PAGE_PATH_LIST.pageComponentPreviewPath}:id`,
      name: 'Preview Page',
    },
    pageComponentEdit: {
      path: `${PAGE_PATH_LIST.pageComponentEditPath}:id`,
      name: 'Edit Page',
    },
  };
  