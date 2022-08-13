import React, { useEffect, useState } from 'react';
import GenForm from '../gen-form';
import GenPage from '../gen-page';
function palindrome(str: string) {
  const arr = str.replace(
    /[-`:_.~!@#$%^&*()=<>?"{}|, ;' \\ [ \] ·~！@#￥%……&*（）——={}|《》？：“”【】、；‘’，。、]/g,
    '',
  );
  return arr;
}

export const useLoaderPreset = (cdn_url: string): any => {
  const [sdk, setSdk] = useState<any>();
  let version: null | string | RegExpMatchArray = cdn_url.match(
    /(?<=ttspc-render@).*(?=\/dist)/g,
  );
  useEffect(() => {
    if (!cdn_url) return;

    // 版本号处理
    let filteredVersion = '';
    if (version) {
      version = version[0];
      filteredVersion = 'V' + palindrome(version.toUpperCase());
    }

    const sc = document.createElement('script');
    sc.setAttribute('no-entry', 'true');
    sc.type = 'text/javascript';
    sc.src = cdn_url;
    document.head.appendChild(sc);

    const lk = document.createElement('link');
    lk.href = cdn_url.replace(/\.js/, '.css');
    lk.type = 'text/css';
    lk.rel = 'stylesheet';
    document.head.appendChild(lk);
    // console.log('loading css');

    lk.onload = () => {
    //   console.log('load css success');
    };
    sc.onload = () => {
      setSdk((window as any)[filteredVersion]);
    };
    sc.onerror = () => {
      setSdk({
        GenForm,
        GenPage,
      });
    };
  }, [cdn_url]);

  return sdk;
};
