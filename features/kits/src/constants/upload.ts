export enum FileTypeEnum {
    Video = 'Video',
    Pdf = 'Pdf',
  }
  
  export const DEFAILT_UPLOAD_CONFIG = {
    [FileTypeEnum.Video]: {
      accept: '.mp4',
      size: 30 * 1024 * 1024,
    },
    [FileTypeEnum.Pdf]: {
      accept: '.pdf',
      size: 30 * 1024 * 1024,
    },
    image: {
      accept: '.jpg,.png,.jpeg',
      size: 5 * 1024 * 1024,
    },
  };
  
  const isBoe = 1;
  
  const APP_NAME = isBoe ? 'oec_affiliate_partner' : 'oec_partner';
  
  export const UPLOAD_URL = `${location.origin}/wsos_v2/${APP_NAME}/upload`;
  
  export const MESSAGES = {
    [FileTypeEnum.Video]: {
      key: 'ecom_partner_platform_livehost_upload_popup_video_upload',
      message: 'Upload Video',
    },
    [FileTypeEnum.Pdf]: {
      key: 'ecom_partner_platform_livehost_upload_popup_cv_upload',
      message: 'Upload PDF',
    },
    uploadImage: {
      key: 'ecom_partner_platform_livehost_upload_popup_language_certificate_upload',
      message: 'Upload Image',
    },
    uploading: {
      key: 'ecom_partner_platform_livehost_upload_popup_toast_uploading',
      message: 'Uploading',
    },
    uploadFailed: {
      key: 'ecom_partner_platform_livehost_upload_popup_toast_upload_failure1',
      message: 'Upload Failed',
    },
    delete: {
      key: 'ecom_partner_platform_livehost_upload_popup_delete',
      message: 'Delete',
    },
    preview: {
      key: 'ecom_partner_platform_livehost_upload_popup_preview',
      message: 'Preview',
    },
    download: {
      key: 'ecom_partner_platform_livehost_upload_popup_download',
      message: 'Download',
    },
    wrongFormat: {
      key: 'ecom_partner_platform_livehost_upload_popup_toast_format',
      message: 'Wrong format, please try again',
    },
    limitSize: {
      key: 'ecom_partner_platform_livehost_upload_popup_toast_size',
      message: 'Please select a file within the size limt',
    },
    reupload: {
      key: 'ecom_partner_platform_livehost_upload_popup_reupload',
      message: 'Re-upload',
    },
  };
  
  export const IMAGE_ACCEPT_LIST = ['image/png', 'image/jpeg', 'image/jpg'].join(',');
  export const PDF_ACCEPT_LIST = ['application/pdf'].join(',');
  export const VIDEO_ACCEPT_LIST = ['video/mp4', 'video/quicktime', 'video/x-flv', 'video/hls', 'application/dash+xml', 'audio/mp4a-lat'].join(',');
  
  export const DEFAULT_SERVICE_LOGO = 'https://sf16-sg.tiktokcdn.com/obj/eden-sg/nupxuldvi/open/tt-icons/open-app-icon.svg';
  