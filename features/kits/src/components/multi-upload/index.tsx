import React, { ChangeEvent, ReactNode, useEffect } from 'react';
import { Modal } from '@arco-design/web-react';
import { xor } from 'lodash';
import { ReactComponent as PlusIcon } from '@/svg/cross-icon.svg';
import { ReactComponent as ErrorIcon } from '@/svg/error-icon.svg';
import { ReactComponent as RefreshIcon } from '@/svg/refresh-icon.svg';
import { ReactComponent as DelIcon } from '@/svg/del-icon.svg';
import { ReactComponent as EyeIcon } from '@/svg/eye-open-icon.svg';
// import { ReactComponent as UploadIcon } from '@/svg/upload-icon.svg';

import CacheImg from '@/components/cache-img';
import { useDebounce } from '@/hooks/debounce';
import { useImmer } from 'use-immer';
import PdfImg from '@/svg/pdf-icon.svg';
import { ReactComponent as VideoIcon } from './video-icon.svg';
import style from './style.module.scss';
import { genLocalKey, usePromiseRejector } from '@/utils/key';
import { FileInfo } from '@/utils/upload/types';

enum UploaderStatus {
  init,
  uploading,
  failed,
  success,
  fallback,
}

export interface UploadProps {
  className?: string;
  accept?: string;
  maxFileAmount?: number;
  beforeSelect?: () => boolean;
  beforeUpload?: (file: File) => string | void;
  onUpload?: (
    file: File,
    options?: {
      type?: 'image' | 'video' | 'object';
      // scene?: 0 | 1 | 2;
      uid?: string;
      key?: string;
      onProgress?: (x: number) => void;
    },
  ) => Promise<FileInfo>;
  onAbort?: () => void;
  customImg?: string;
  value?: FileInfo[];
  fallbackUrl?: string;
  onChange?: (fileInfo?: FileInfo[]) => void;
  uploadBntTxt?: string | React.ReactElement;
  showUploadBlock?: boolean;
  showPreviewBtn?: boolean | ((fileInfo: UploadItem) => boolean);
  showDeleteBtn?: boolean | ((fileInfo: UploadItem) => boolean);
}

function readFileAsDataUrl(file: File) {
  return URL.createObjectURL(file);
}

let inputEle: HTMLInputElement;
export function selectFile(accept?: string, isMultiple?: boolean): Promise<void | File[]> {
  return new Promise(function (resolve, reject) {
    if (!inputEle) {
      inputEle = document.createElement('input');
      inputEle.setAttribute('type', 'file');
      inputEle.setAttribute('style', 'display: none');
      document.body.appendChild(inputEle);
    }
    if (isMultiple) {
      inputEle.setAttribute('multiple', 'multiple');
    } else {
      inputEle.removeAttribute('multiple');
    }
    inputEle.setAttribute('accept', accept || '*');
    // @ts-ignore
    inputEle.onchange = function (e: ChangeEvent<HTMLInputElement>) {
      const files = Array.from(e.target.files ?? []);
      if (!files) {
        resolve(undefined);
      }
      e.target.files = null;
      e.target.value = '';
      resolve(files);
    };
    inputEle.click();
  });
}

export interface UploadItem {
  file?: File;
  fileInfo?: FileInfo;
  status: UploaderStatus;
  failReason?: string;
  progress?: number;
  key: string;
  dataUrl?: string;
}

export function MultiUpload(props: UploadProps) {
  const [f, setF] = useImmer<UploadItem[]>(
    props.value?.map(v => ({
      key: genLocalKey(),
      fileInfo: v,
      status: UploaderStatus.success,
    })) || [],
  );

  const maxFileAmount = props.maxFileAmount || 1;
  const leftLength = maxFileAmount - (props.value?.length || 0);
  const isMultiple = leftLength > 1;
  // console.log('isMultiple', isMultiple);
  const rejector = usePromiseRejector();

  function upsertUploadItem(newItem: UploadItem) {
    setF(draft => {
      const item = draft.find(x => x.key === newItem.key);
      if (item) {
        Object.assign(item, newItem);
      } else {
        draft.push(newItem);
      }
    });
  }
  useEffect(
    function () {
      const newValue = f.map(x => x.fileInfo).filter(Boolean);
      const diff = xor(
        newValue.map(x => x?.file_id).filter(Boolean),
        props.value?.map(x => x.file_id),
      );
      if (diff.length) {
        // @ts-ignore
        props.onChange?.(newValue);
      }
    },
    [f],
  );
  const syncPropValue = useDebounce(function () {
    const diff = xor(
      f.map(f => f?.fileInfo?.file_id).filter(Boolean),
      props.value?.map(x => x?.file_id),
    );
    if (diff.length) {
      setF(
        props.value?.map(x => ({
          key: genLocalKey(),
          fileInfo: x,
          status: UploaderStatus.success,
        })) ?? [],
      );
    }
  }, 500);
  useEffect(syncPropValue, [props.value]);

  async function handleUpload(uploadItem: UploadItem) {
    if (!uploadItem.file) {
      upsertUploadItem({ ...uploadItem, status: UploaderStatus.failed });
      return;
    }
    const checkResult = props.beforeUpload?.(uploadItem.file);
    if (checkResult) {
      upsertUploadItem({
        ...uploadItem,
        status: UploaderStatus.failed,
        failReason: checkResult,
      });
      return;
    }
    const dataUrl = readFileAsDataUrl(uploadItem.file);
    upsertUploadItem({
      ...uploadItem,
      fileInfo: {
        file_id: genLocalKey('--file-uploading-temp-id'),
      },
      status: UploaderStatus.uploading,
      dataUrl,
    });
    try {
      const _f = await Promise.race([
        props.onUpload?.(uploadItem.file, {
          onProgress(progress: number) {
            setF(draft => {
              const item = draft.find(x => x.key === uploadItem.key);
              if (item) {
                item.progress = progress;
              }
            });
          },
        }),
        rejector(),
      ]);
      if (!_f) {
        throw new Error('empty file');
      }
      if (_f && !_f?.url) {
        _f.url = dataUrl;
      }
      upsertUploadItem({
        ...uploadItem,
        status: UploaderStatus.success,
        fileInfo: _f,
      });
    } catch (e) {
      if (e === 'abort') {
        return;
      }
      upsertUploadItem({
        ...uploadItem,
        failReason: 'Upload failed.',
        status: UploaderStatus.failed,
      });
    }
  }

  function handleDelFile(key: string) {
    const canselect = props.beforeSelect?.() ?? true;
    if (!canselect) {
      return;
    }
    const index = f.findIndex(x => x.key === key);
    const item = f[index];
    if (item.status === UploaderStatus.uploading) {
      rejector.reject?.('abort');
      props.onAbort?.();
    }
    setF(draft => {
      const index = draft.findIndex(x => x.key === key);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    });
  }

  async function handleClickUpload() {
    const canselect = props.beforeSelect?.() ?? true;
    if (!canselect) {
      return;
    }
    const files = await selectFile(props.accept, isMultiple);

    if (!files) {
      return;
    }

    await Promise.all(files.slice(0, leftLength).map(async (file) => {
      const uploadItem: UploadItem = {
        key: genLocalKey(),
        status: UploaderStatus.uploading,
        file,
      };
      upsertUploadItem(uploadItem);
      return handleUpload(uploadItem);
    }));
  }

  async function handleClickRefresh(key: string) {
    const files = await selectFile(props.accept, false);
    if (!files) {
      return;
    }
    const uploadItem: UploadItem = {
      key,
      status: UploaderStatus.uploading,
      file: files[0],
    };
    upsertUploadItem(uploadItem);
    await handleUpload(uploadItem);
  }

  return (
    <div className={[style.uploader, props.className].join(' ')}>
      {f.map(item => {
        const fileType = item.file?.type || item.fileInfo?.file_type;
        let previewImg = item.dataUrl;
        if (!previewImg) {
          previewImg = item.fileInfo?.url;
        }
        if (fileType?.startsWith('video')) {
          if (item.fileInfo?.preview?.length) {
            previewImg = item.fileInfo.preview[0].url;
          } else {
            previewImg = undefined;
          }
        }
        if (fileType === 'application/pdf') {
          previewImg = PdfImg;
        }
        if (props.customImg) {
          previewImg = props.customImg;
        }
        return (
          <div
            key={item.key}
            className={[
              style.container,
              [UploaderStatus.failed, UploaderStatus.uploading].includes(
                item.status,
              ) && 'oec-open-uploader',
            ].join(' ')}>
            {item.status === UploaderStatus.uploading && (
              <Progress
                onDel={handleDelFile.bind(undefined, item.key)}
                progress={item.progress ?? 0}
              />
            )}
            {item.status === UploaderStatus.failed && (
              <Failed
                onDel={handleDelFile.bind(undefined, item.key)}
                onRefresh={handleClickRefresh.bind(undefined, item.key)}
                reason={item.failReason}
              />
            )}
            {item.status === UploaderStatus.success && (
              <Preview
                defaultIcon={<VideoIcon style={{ width: 36, height: 36 }} />}
                showPreviewBtn={
                  typeof props.showPreviewBtn === 'function'
                    ? props.showPreviewBtn(item)
                    : props.showPreviewBtn !== false
                }
                showDeleteBtn={
                  typeof props.showDeleteBtn === 'function'
                    ? props.showDeleteBtn(item)
                    : props.showDeleteBtn !== false
                }
                onPreview={function () {
                  const url = item.dataUrl || item.fileInfo?.url;
                  if (
                    !fileType?.startsWith('image') &&
                    !fileType?.startsWith('video')
                  ) {
                    window.open(url);
                    return;
                  }
                  if (props.customImg) {
                    window.open(url);
                  } else {
                    const m = Modal.info({
                      maskClosable: true,
                      closable: false,
                      className: style.previewModal,
                      footer: null,

                      hideCancel: true,
                      title: null,
                      icon: null,
                      content: fileType?.startsWith('video') ? (
                        <>
                          <video
                            controls={true}
                            preload={'preload'}
                            src={item.fileInfo?.url || ''}
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                          />
                        </>
                      ) : (
                        <CacheImg
                          src={url}
                          onClick={function () {
                            m.close();
                          }}
                        />
                      ),
                    });
                  }
                }}
                onDel={handleDelFile.bind(undefined, item.key)}
                src={previewImg}
              />
            )}
          </div>
        );
      })}
      {f.length < maxFileAmount && (
        <div className={[style.container].join(' ')}>
          <UploadButton
            fileAmount={maxFileAmount}
            currentAmount={f.length + 1}
            text={props.uploadBntTxt}
            onClick={handleClickUpload}
          />
        </div>
      )}
    </div>
  );
}

interface PreviewProps {
  src?: string;
  type?: string;
  defaultIcon?: ReactNode;
  onDel?: () => void;
  onPreview?: () => void;

  showPreviewBtn?: boolean;
  showDeleteBtn?: boolean;
}
function Preview(props: PreviewProps) {
  return (
    <div className={style.success}>
      {props.src?.length ? (
        <CacheImg
          className={[style.baseLayer, style.img].join(' ')}
          src={props.src}
        />
      ) : (
        props.defaultIcon
      )}

      {(props.showPreviewBtn !== false || props.showDeleteBtn !== false) && (
        <div className={style.hoverLayer}>
          {props.showPreviewBtn !== false && (
            <EyeIcon onClick={props.onPreview} className={style.btn} />
          )}
          {props.showDeleteBtn !== false && (
            <DelIcon onClick={props.onDel} className={style.btn} />
          )}
        </div>
      )}
    </div>
  );
}

interface FailedProps {
  reason?: string;
  onDel?: () => void;
  onRefresh?: () => void;
}
function Failed(props: FailedProps) {
  return (
    <div className={style.failed}>
      <div className={style.baseLayer}>
        <ErrorIcon className={style.icon} />
        <div className={style.txt}>{props.reason}</div>
      </div>
      <div className={style.hoverLayer}>
        <RefreshIcon onClick={props.onRefresh} className={style.btn} />
        <DelIcon onClick={props.onDel} className={style.btn} />
      </div>
    </div>
  );
}

// interface NoInitProps {
//   fallbackUrl?: string;
//   onUpload?: () => void;
// }
// function FallbackPreview(props: NoInitProps) {
//   return (
//     <div className={style.noInit}>
//       <div className={style.baseLayer}>
//         <CacheImg src={props.fallbackUrl} />
//       </div>
//       <div className={style.hoverLayer}>
//         <Tooltip content="Upload your own image.">
//           <UploadIcon onClick={props.onUpload} className={style.btn} />
//         </Tooltip>
//       </div>
//     </div>
//   );
// }

interface ProgressBarProps {
  progress: number;
  onDel?: () => void;
}

function Progress(props: ProgressBarProps) {
  return (
    <div className={style.progressBtn}>
      <div className={style.baseLayer}>
        <div className={style.txt}>Uploading</div>
        <div className={style.progressBar}>
          <div
            style={{
              transform: `scaleX(${props.progress * 100}%)`,
            }}
            className={style.progressBarInner}></div>
        </div>
      </div>
      <div className={style.hoverLayer}>
        <DelIcon onClick={props.onDel} className={style.btn} />
      </div>
    </div>
  );
}

interface BtnProps {
  onClick: () => void;
  text?: string | React.ReactElement;
  fileAmount?: number;
  currentAmount?: number;
}
function UploadButton(props: BtnProps) {
  const fileAmount = props.fileAmount ?? 1;
  return (
    <div onClick={props.onClick} className={style.uploadBtn}>
      <PlusIcon className={style.icon} />
      <div className={style.txt}>
        <div>{props.text || 'Upload file'}</div>
        {fileAmount > 1 ? (
          <div>
            ({props.currentAmount ?? 0}/{fileAmount})
          </div>
        ) : null}
        <div>{}</div>
      </div>
    </div>
  );
}

// function PreviewModal(props: { url?: string; modal: any }) {
//   return (
//     <Modal

//     </Modal>
//   );
// }
