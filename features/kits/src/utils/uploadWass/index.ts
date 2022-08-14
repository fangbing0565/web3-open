import fetch from '../fetch'
import {
  ContentType,
  HttpMethod,
} from '@i18n-ecom/lib/dist/commonjs/fetch';
export const uploadWass = async (
  file: File,
): Promise<{ uri: string; oid?: string }> => {
  const formData = new FormData();
  formData.append('data', file);
  const res = (await fetch('/wsos_v2/oec_affiliate_partner/upload', {
    method: HttpMethod.post,
    headers:{
      'Content-Type': 'multipart/form-data',
    },
    body: {
      // @ts-ignore
      data: file,
    }
  })) as { uri: string; oid: string };
  return { uri: decodeURIComponent(res.uri), oid: res.oid };
};
