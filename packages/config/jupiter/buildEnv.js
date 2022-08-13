const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { findMonorepoRoot } = require('../utils/monorepo');

const COMMAND_ROOT = process.env.INIT_CWD
  ? `${process.env.INIT_CWD}`
  : process.cwd();
let PROJECT_ROOT = findMonorepoRoot(COMMAND_ROOT);
if (!PROJECT_ROOT) {
  PROJECT_ROOT = COMMAND_ROOT;
}
const WORKSPACE_ROOT = `${process.env.PWD}`;

if (process.env.NODE_ENV === 'development') {
  useDevEnv();
}

const {
  NODE_ENV,
  CUSTOM_DEVELOP_ENV = 'LOCAL',
  CUSTOM_BUILD_APP = 'TTS',
  CUSTOM_KEEP_UNIHAN_REGION,
  TASK_FROM, // 'scm'
  BUILD_BASE_COMMIT_HASH,
  BUILD_BRANCH = 'LOCAL',
  BUILD_PUB_DATE,
  BUILD_VERSION,
  JUPITER_IS_PROXY,
} = process.env;

const IS_ANALYZE = process.argv.includes('--analyze');
let PUBLIC_URL_PREFIX = `/obj/archi-sg/18n/ecom/partner_center/`;

const envs = {
  PROJECT_ROOT, // eg: /Users/bytedance/WebstormProjects/i18n_ttspc
  COMMAND_ROOT, // eg: /Users/bytedance/WebstormProjects/i18n_ttspc/apps/main or same as PROJECT_ROOT
  WORKSPACE_ROOT, // eg: /Users/bytedance/WebstormProjects/i18n_ttspc/apps/main
  NODE_ENV, // development, production
  DEVELOP_ENV: CUSTOM_DEVELOP_ENV, // BOE, PPE
  BUILD_ASPECT_UNIHAN: CUSTOM_KEEP_UNIHAN_REGION === 'true', // aspect 2 for build no unihan, true or false
  BUILD_ASPECT_APP: CUSTOM_BUILD_APP, // aspect 1 for build diff app, 'TTS' or 'FANS'
  BUILD_INFO: {
    // set by SCM version
    build_base_commit_hash: BUILD_BASE_COMMIT_HASH,
    build_branch: BUILD_BRANCH,
    build_pub_date: BUILD_PUB_DATE,
    build_version: BUILD_VERSION,
  },
  IS_PROD: NODE_ENV === 'production',
  IS_DEV: NODE_ENV === 'development',
  IS_ONLINE: CUSTOM_DEVELOP_ENV === 'ONLINE',
  IS_SCM_BUILD: TASK_FROM === 'SCM',
  IS_ANALYZE,
  IS_PROXY: JUPITER_IS_PROXY === 'true',
};
let ASPECT_PATH = path.join(
  envs.BUILD_ASPECT_APP,
  envs.BUILD_ASPECT_UNIHAN ? '/unihan' : '/normal',
);
if (envs.IS_DEV && !envs.IS_PROXY) {
  ASPECT_PATH = '';
  PUBLIC_URL_PREFIX = '';
}

envs.PATH = {
  ASPECT_PATH,
  DIST_PATH: `./dist/${ASPECT_PATH}`,
  PUBLIC_URL: `${PUBLIC_URL_PREFIX}${ASPECT_PATH}/`,
  PUBLIC_URL_PREFIX,
};
// eslint-disable-next-line no-console
console.log('[current env]:', JSON.stringify(envs, null, 2));

module.exports = envs;

function useDevEnv() {
  const envPath = path.resolve(PROJECT_ROOT, '.env');
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(
      envPath,
      `
# You can change ENV Here
# CUSTOM_BUILD_APP=TTS
# LOCAL_DEVELOP_IDC=SG
JUPITER_IS_PROXY=false
JUPITER_IS_LSOF=true
`,
    );
  }
  dotenv.config({
    path: envPath,
    override: true,
  });
}
