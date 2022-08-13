import { getUUID } from './math';

/** 文件来源 */
const enum FileSrc {
  FILE_SRC_UNKNOWN = 0,
  FILE_SRC_PSS = 1,
  FILE_SRC_IMAGEX = 2,
  FILE_SRC_TOS = 3,
}

interface FileInfo {
  /** 保存FileInfo：传；   业务写接口：传；   业务读接口：返回 */
  file_id?: string;
  /** 保存FileInfo：传；   业务写接口：不传； 业务读接口：返回 */
  file_type?: string;
  /** 保存FileInfo：不传； 业务写接口：不传； 业务读接口：返回 */
  url?: string;
  /** 保存FileInfo：传；   业务写接口：不传； 业务读接口：不返回 */
  file_src?: FileSrc;
  /** 保存FileInfo：传；   业务写接口：不传； 业务读接口：根据业务场景判断是否返回 */
  file_name?: string;
  /** 预览图list */
  preview?: Array<FileInfo>;
}

function generateFileInfoFromUrl(url?: string, file_type = 'image/png', file_src = FileSrc.FILE_SRC_IMAGEX) {
  if (!url) return;
  const id = getUUID()
  return {
    file_id: id,
    file_type,
    url,
    file_src,
    file_name: id,
  }
}

export function generateImageFileInfoFromUrlWithImageX(url?: string) {
  return generateFileInfoFromUrl(url);
}

export function generateVideoFileInfoFromUrlWithImageX(url?: string) {
  return generateFileInfoFromUrl(url, 'video/mp4');
}

function parseUrlFromFileInfo(fileInfo?: FileInfo) {
  if (!fileInfo) return;
  return fileInfo.file_id;
}

export function parseImageUrlFromFileInfo(fileInfo?: FileInfo) {
  if (!fileInfo) return;
  return parseUrlFromFileInfo(fileInfo);
}

export function parseVideoUrlFromFileInfo(fileInfo?: FileInfo) {
  if (!fileInfo) return [undefined, []];
  return [
    parseUrlFromFileInfo(fileInfo),
    parseUrlFromFileInfo(fileInfo.preview?.[0])
  ];
}
