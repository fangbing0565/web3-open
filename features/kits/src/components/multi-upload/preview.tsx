import React from 'react';
import { ReactComponent as EyeIcon } from '@/svg/eye-open-icon.svg';
import CacheImg from '@/components/cache-img';
import { Modal } from '@arco-design/web-react';
import style from './style.module.scss';

interface PreviewProps {
  src?: string;
  type?: 'video' | 'img';
  // onDel?: () => void;
  // onPreview?: () => void;
}

export function ImgPreview(props: PreviewProps) {
  function handlePreview() {
    const m = Modal.info({
      maskClosable: true,
      className: style.previewModal,
      footer: null,
      closable: false,
      hideCancel: true,
      title: null,
      icon: null,
      content:
        props.type === 'video' ? (
          <>
            <video src={props.src} />
          </>
        ) : (
          <CacheImg
            src={props.src}
            onClick={function () {
              m.close();
            }}
          />
        ),
    });
  }
  return (
    <div className={style.container}>
      <div className={style.preview}>
        <CacheImg
          className={[style.baseLayer, style.img].join(' ')}
          src={props.src}
        />
        <div className={style.hoverLayer}>
          <EyeIcon onClick={handlePreview} className={style.btn} />
        </div>
      </div>
    </div>
  );
}
