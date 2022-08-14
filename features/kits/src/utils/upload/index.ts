import BytedUploader, { CompleteEventInfo } from '@byted/uploader';
import { isBOE } from '../envs';
import { SaveFileInfo, GetResourceUploadToken, GetResourceUrlFromUri } from './apis';
import { BusinessScene, FileInfo, FileSrc, PssFileType, ResourceType, ResourceUploadToken } from './types';
import { APP_ID } from '../../constants';

// migration from partner center
const isFans = false;
let pssAid = 0;

if (isBOE()) {
  pssAid = isFans ? 91 : 90;
} else {
  pssAid = isFans ? 10000023 : 10000022;
}

function XhrUpload(
  url: string,
  data: FormData,
  options?: {
    onProgress?: (x: number) => void;
  },
): Promise<any> {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    if (xhr.upload) {
      xhr.upload.onprogress = function (e: ProgressEvent<any>) {
        if (e) {
          options?.onProgress?.(e.loaded / e.total);
        }
      };
    }
    xhr.onerror = reject;
    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300) {
        return reject(new Error(`failed${xhr.status}`));
      }
      resolve(JSON.parse(xhr.responseText));
      return undefined;
    };
    xhr.open('post', url, true);
    xhr.send(data);
  });
}
export async function pssUpload(
  file: File,
  options?: {
    scene?: BusinessScene;
    channel?: string;
    onProgress?: (x: number) => void;
  },
) {
  const fileInfo: FileInfo = {
    file_name: file.name,
    scene: options?.scene,
  };
  let ftype = PssFileType.other;
  const fileType = file.type;
  if (file.type.startsWith?.('image/')) {
    ftype = PssFileType.img;
  }
  const data = new FormData();
  data.append('app_id', `${pssAid}`);
  data.append('channel_key', options?.channel || '');
  data.append('ftype', ftype);
  // data.append('uid', props.uid);
  data.append('file', file);
  // const xhr = new XMLHttpRequest();
  const resJson = await XhrUpload('/pssresource/external/upload', data, {
    onProgress: options?.onProgress,
  });
  // console.log(res);
  // if (xhr.upload) {
  //   xhr.upload.onprogress = function (e: ProgressEvent<any>) {
  //     if (e) {
  //       options?.onProgress?.(e.loaded / e.total);
  //     }
  //   };
  // }
  // const res = await fetch('/pssresource/external/upload', {
  //   method: 'post',
  //   body: data,
  // });
  // const resJson = await res.json();
  if (resJson?.code !== 0) {
    throw resJson;
  }
  const _v: FileInfo = {
    ...resJson?.data,
    url: resJson.ticket_url,
    file_type: fileType,
  };
  // @ts-ignore
  delete _v.ticket_url;
  Object.assign(fileInfo, _v);
  await SaveFileInfo({
    data: fileInfo,
  });
  return {
    url: _v.url,
    type: file.type,
    filename: file.name,
    file_id: _v.file_id,
    ...fileInfo,
  };
}

interface UploadOptions {
  type?: 'image' | 'video' | 'object';
  // scene?: 0 | 1 | 2;
  uid?: string;
  key?: string;
  onProgress?: (x: number) => void;
};

async function imageXUpload(
  f: File,
  options?: UploadOptions,
) {
  const type = options?.type || 'image';
  let resource_type = ResourceType.ImageX;
  if (type === 'video') {
    resource_type = ResourceType.Vod;
  }
  if (type === 'object') {
    resource_type = ResourceType.Vod;
  }
  const res = await GetResourceUploadToken({
    resource_type,
  });
  if (!res.data) {
    throw res;
  }
  const result = await _imagexUpload(f, res.data, {
    ...options,
    type,
  });
  await SaveFileInfo({ data: result });
  return result;
}

export const imageXUploadImage = imageXUpload;
export const imageXUploadVideo = (
  f: File,
  options?: UploadOptions,
) => imageXUpload(f, { ...options, type: 'video' });
export const imageXUploadObject = (
  f: File,
  options?: UploadOptions,
) => imageXUpload(f, { ...options, type: 'object' });

const boeServiceId = isFans ? 'j5o9pyakqg' : 'jvtte31kaf';
const prodServiceId = isFans ? 'cjnm8cla78' : '7bzkn4wnzc';

const uploadingTask = new Map();

export function cancelUpload(key: string) {
  const uploader = uploadingTask.get(key);
  uploader?.cancel();
}

function _imagexUpload(
  f: File,
  stsToken: ResourceUploadToken,
  options: {
    type: 'image' | 'video' | 'object';
    scene?: BusinessScene;
    uid?: string;
    key?: string;
    onProgress?: (x: number) => void;
  },
) {
  const bytedUploader = new BytedUploader({
    userId: options?.uid || '',
    appId: APP_ID,
    region: isBOE() ? 'boei18n' : 'ap-singapore-1',
    videoHost: isBOE()
      ? 'https://vas-boei18n.bytedance.net'
      : 'https://vod-ap-singapore-1.bytevcloudapi.com',
    imageHost: isBOE()
      ? 'https://vas-boei18n.bytedance.net'
      : 'https://vod-ap-singapore-1.bytevcloudapi.com',
    imageConfig: {
      serviceId: isBOE() ? boeServiceId : prodServiceId,
    },
    videoConfig: {
      spaceName: isBOE()
        ? 'oec_open_video_tts_boei18n'
        : 'oec_open_developer_center',
      processAction: [
        {
          name: 'GetMeta',
        },
        {
          name: 'Snapshot',
          input: {
            SnapshotTime: 0,
          },
        },
      ],
    },
  });
  const fileKey = bytedUploader.addFile({
    file: f,
    stsToken,
    type: options?.type,
  });
  return new Promise<FileInfo>(function (resolve, reject) {
    let t = 0;
    const timer = setInterval(function () {
      t += 0.02;
      options?.onProgress?.(Math.max(0, 1 - Math.exp(-1 * t) - 0.02));
    }, 100);
    uploadingTask.set(options?.key, bytedUploader);
    bytedUploader.on('complete', async (res: CompleteEventInfo) => {
      if (options.type === 'image') {
        const result: FileInfo = {
          file_id: res.uploadResult?.Uri,
          file_name: f.name,
          file_type: f.type,
          file_src: FileSrc.FILE_SRC_IMAGEX,
        };
        resolve(result);
      } else if (options.type === 'video') {
        let cover_fileInfo: FileInfo | undefined;
        if (res?.uploadResult?.PosterUri) {
          const result = await GetResourceUrlFromUri({
            uri: res.uploadResult.PosterUri,
          });
          if (result.data?.url) {
            cover_fileInfo = {
              file_id: res.uploadResult.PosterUri,
              file_src: FileSrc.FILE_SRC_IMAGEX,
              // file_name: f.name,
              file_type: 'image/jpeg',
              url: result.data.url,
            };
            await SaveFileInfo({
              data: cover_fileInfo,
            });
          }
        }

        const result: FileInfo = {
          file_id: res.uploadResult.Vid,
          file_name: f.name,
          file_type: f.type,
          file_src: FileSrc.FILE_SRC_IMAGEX,
          ...(cover_fileInfo?.url && {
            preview: [cover_fileInfo],
          }),
        };
        resolve(result);
      } else if (options.type === 'object') {
        const result: FileInfo = {
          file_id: res.uploadResult?.Uri,
          file_name: f.name,
          file_type: f.type,
          file_src: FileSrc.FILE_SRC_IMAGEX,
        };
        resolve(result);
      }
      clearInterval(timer);
      uploadingTask.delete(options?.key);
    });
    bytedUploader.on('error', function (e) {
      reject(e);
      clearInterval(timer);
      uploadingTask.delete(options?.key);
    });
    bytedUploader.start(fileKey);
  });
}
