// @ts-ignore TODO
import * as secsdk from '@byted/secsdk';

export function initCSRF() {
  secsdk?.csrf?.setProtectedHost({
    [window.location.host]: {
      POST: /^\/api\/v\d\/(?!sandbox)/,
    },
  });
}

