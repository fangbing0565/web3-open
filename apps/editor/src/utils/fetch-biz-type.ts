import { fetch } from '@oec-open/ttspc-kits';
import { useEffect, useState } from 'react';

export type BizTypeItem = {
  biz_type_id: number;
  biz_type_key: string;
  biz_type_label: string;
};

let json: BizTypeItem[] = [];

export const fetchBizType = () => {
  const url = IS_BOE
    ? 'https://tosv.boe.byted.org/obj/ies-fe-bee-test/bee_test/biz_1/bee_test_1_bee_publish_3997.json'
    : 'https://lf3-beecdn.bytetos.com/obj/ies-fe-bee/bee_prod/biz_1/bee_prod_1_bee_publish_10459.json';

  return new Promise((resolve: any, reject) => {
    if (json?.length) {
      resolve(json);
      return;
    }
    fetch(url).catch(error => {
      if (error?.httpStatus === 200 && error?.bee_dsrc_4964) {
        json = error?.bee_dsrc_4964;
        resolve(error?.bee_dsrc_4964);
      } else {
        reject(error);
      }
    });
  });
};

export const useBizType = () => {
  const [bizTypeList, setBizTypeList] = useState<BizTypeItem[]>([]);

  useEffect(() => {
    if (json?.length) {
      setBizTypeList(json);
    } else {
      fetchBizType().then(res => {
        setBizTypeList(res as BizTypeItem[]);
      });
    }
  }, []);

  return [bizTypeList];
};

export const getBizTypeName = (bizType: number, bizTypeList: BizTypeItem[]) => {
  return bizTypeList.find(biz => biz.biz_type_id === bizType)?.biz_type_label;
};
