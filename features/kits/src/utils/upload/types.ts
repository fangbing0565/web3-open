
/** 业务场景 */
export const enum BusinessScene {
    SCENE_UNKNOWN = 0,
    SCENE_ACCOUNT = 1,
    SCENE_APPLICATION = 2,
  }
  
  export interface FileInfo {
    /** 保存FileInfo：传；   业务写接口：传；   业务读接口：返回 */
    file_id?: string;
    /** 保存FileInfo：传；   业务写接口：不传； 业务读接口：返回 */
    file_type?: string;
    /** 保存FileInfo：不传； 业务写接口：不传； 业务读接口：返回 */
    url?: string;
    /** 保存FileInfo：传；   业务写接口：不传； 业务读接口：不返回 */
    scene?: BusinessScene;
    /** 保存FileInfo：传；   业务写接口：不传； 业务读接口：不返回 */
    file_src?: FileSrc;
    /** 保存FileInfo：传；   业务写接口：不传； 业务读接口：根据业务场景判断是否返回 */
    file_name?: string;
    /** 预览图list */
    preview?: Array<FileInfo>;
  }
  
  /** 文件来源 */
  export const enum FileSrc {
    FILE_SRC_UNKNOWN = 0,
    FILE_SRC_PSS = 1,
    FILE_SRC_IMAGEX = 2,
    FILE_SRC_TOS = 3,
  }
  
  export const enum ResourceType {
    ResourceType_UNKNOWN = 0,
    ImageX = 1,
    Vod = 2,
  }
  
  export interface ResourceUploadToken {
    AccessKeyId: string;
    SecretAccessKey: string;
    SessionToken: string;
    ExpiredTime: string;
    CurrentTime: string;
  }
  
  export const enum PssFileType {
    img = '1',
    other = '2',
  }
  