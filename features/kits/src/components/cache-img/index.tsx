import React, { useEffect, useState } from 'react';
// import slardar from '@jupiter/plugin-runtime/slardar';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  cacheKey?: string;
}

function X(src: string): Promise<string> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;

  return new Promise(function (resolve, reject) {
    img.onerror = reject;
    img.onabort = reject;
    img.onload = function () {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob(b => {
          // @ts-ignore
          resolve(URL.createObjectURL(b));
        });
      } catch (e) {
        reject(e);
      }
    };
  });
}

const imgCache = new Map();
async function getImgData(src: string, k: string): Promise<string> {
  try {
    if (!src.startsWith?.('http')) {
      return src;
    }
    const secSrc = src.replace(/^http:/, 'https:');
    const objUrl = await X(secSrc);
    if (objUrl) {
      imgCache.set(k, objUrl);
    }
    return objUrl;
  } catch (e) {
    const u = new URL(src);
    // slardar.sendEvent?.({
    //   name: 'cache_img_error',
    //   metrics: {
    //     count: 1,
    //   },
    //   categories: {
    //     url: src,
    //     host: u.host,
    //     path: u.pathname,
    //   },
    // });
    return src;
  }
}

export default function CacheImg(props: Props) {
  const { src, cacheKey, ...restprops } = props;
  const [url, seturl] = useState<string>();

  useEffect(
    function () {
      if (!src) {
        return;
      }
      const k = cacheKey || src;
      const cachedUrl = imgCache.get(k);
      if (!cachedUrl) {
        getImgData(src, k).then(x => {
          seturl(x || src);
        });
      } else {
        seturl(cachedUrl);
      }
    },
    [src, cacheKey],
  );
  return <img src={url} {...restprops} />;
}
