import { WebInterfaceSdk } from '@byted-sdk/account-api'; // Single site loginWebInterface
import { TypeInitProps } from '@byted-sdk/account-api/dist/types';
import { envs } from '@oec-open/ttspc-kits';

const IS_BOE = !envs.isProd();
const REGION = 'sg';
const APP_ID = 359713;

console.log('IS_BOE:', IS_BOE);
console.log('env:', envs.getEnv());

const config: TypeInitProps = {
  aid: APP_ID,
  isOversea: true,
  region: REGION,
  isBoe: IS_BOE,
  captchaHost: IS_BOE ? '//boei18n-verify.bytedance.net' : undefined,
  host: '/',
};

const accountSDK = new WebInterfaceSdk(config);

export default accountSDK;
