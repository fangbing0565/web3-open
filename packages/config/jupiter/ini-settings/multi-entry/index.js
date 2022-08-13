/*
 * Config use to multi app or region or idc servers
 * Generate multi html entry like SSG for different country
 * You can see the detail from the doc: https://bytedance.feishu.cn/docx/doxcnFpiBSJJyPyYDBzYWxLGGJf
 * The idea and first version is created by @chensiguo, and refactor by @wangguoyuan
 */
const path = require('path');
const { mergeWith, cloneDeep, isArray } = require('lodash');
const {
  BUILD_ASPECT_APP,
  IS_DEV,
  BUILD_ASPECT_UNIHAN,
} = require('../../buildEnv');
const htmlSnippets = require('./htmlSnippets');

/**
 * Get the config of the specified IDC.
 * @param {string} idc
 * @returns {import('../../../types/runtime').IdcConfig}
 */
function getConfigForIDC(idc) {
  return require(path.resolve(__dirname, './idc_region', `${idc}.js`));
}

/**
 * Get the config of the specified App.
 * @param {import('../../../types/runtime').IdcConfig} idcConfig
 * @param {string} app
 * @returns {import('../../../types/runtime').AppConfig[]}
 */
function getConfigForApp(idcConfig, app) {
  const { common, regions } = require(path.resolve(
    __dirname,
    './app_config',
    `${app}.js`,
  ))(idcConfig);
  return regions.map(region =>
    mergeWith(cloneDeep({ idc: idcConfig, ...common }), region, (a, b, key) =>
      key === 'snippets' && isArray(a)
        ? a.concat(b)
        : isArray(b)
        ? b
        : undefined,
    ),
  );
}
/** @returns  {{[did:string]: AppConfig}} */
function initRuntimeConfig({
  app_list = ['tts'],
  idc_list = ['sg', 'va'],
} = {}) {
  const configMap = idc_list
    .map(idc => {
      const idcConfig = getConfigForIDC(idc);
      return app_list.map(app => getConfigForApp(idcConfig, app));
    })
    .flat(2)
    // filter build app
    .filter(config => {
      return config.app_name.toLowerCase() === BUILD_ASPECT_APP.toLowerCase();
    })
    // keep unihan ??
    .filter(config =>
      !IS_DEV
        ? BUILD_ASPECT_UNIHAN
          ? config.keep_unihan === true
          : config.keep_unihan !== true
        : true,
    )
    .reduce((obj, config) => {
      const {
        idc: { idc_name },
        app_name,
        region_name,
      } = config;
      const did = [idc_name, app_name, region_name]
        .map(id => id.toLowerCase())
        .join('_');
      obj[did] = config;
      return obj;
    }, {});

  if (!Object.keys(configMap).length) {
    throw Error('Your app config may not right, check you env file');
  }
  return configMap;
}

module.exports = {
  getConfig: initRuntimeConfig,
  htmlSnippet: htmlSnippets,
};
