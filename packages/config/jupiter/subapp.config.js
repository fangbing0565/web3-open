const configMerge = require('../utils/configMerge');
const featParts = require('./feat-configs');
const { IS_DEV } = require('./buildEnv');
const initPort = require('./lsof');
const {
  MultiSubAppEntryGeneratorPlugin,
} = require('./plugins/multi-entry-webpack-plugin');
const iniConfig = require('./ini-settings');
/**
 * main app jupiter config
 * @param {String} moduleName module name
 * @param {Object} option base config options
 * @param {Number} option.devPort options port
 * @param {Boolean} option.enableMockGar is micro fe open
 * @param {Object} option.overrideConfig options override
 *
 * @returns {Object} option
 */
const getBaseConfig = (moduleName, option) => {
  const {
    devPort,
    enableMockGar, // when your module not combined with main app, you can enable it temporary
    overrideConfig = {},
  } = option;
  const devPublicUrl = `https://localhost:${devPort}/`;
  initPort(devPort);
  const featConfigs = configMerge(
    featParts.common(moduleName),
    featParts.tailwind(),
    featParts.style(),
    featParts.rmInvalidStr(),
    featParts.importDeal(),
    featParts.replaceSomeModules(),
    featParts.proxy.forSub(devPort, moduleName, enableMockGar),
    featParts.analyze(),
  );

  const config = configMerge(
    featConfigs,
    {
      dev: {
        // 这里要修改成线上地址
        // withMasterApp: {
        //   url: 'https://goofy-boe.bytedance.net/api/garfish_mod/v1/modlist',
        //   rids: [21374],
        // },
        assetPrefix: devPublicUrl,
      },
      deploy: {
        microFrontend: {
          externalBasicLibrary: false, // V5新增属性，external基础库
          moduleApp: moduleName,
          enableHtmlEntry: false,
        },
      },
      runtime: {
        features: {
          state: true,
          router: false,
          tea: false,
          i18next: false,
        },
      },
      tools: {
        webpack: (config, { webpack, appendPlugins }) => {
          if (IS_DEV) {
            config.output.publicPath = devPublicUrl;
          }
          config.entry.main = [iniConfig.injectedJs.common].concat(
            config.entry.main,
          );
          Object.assign(config.output, {
            filename: `${moduleName}.js`,
          });
          // sync with apps/main/src/App.tsx
          Object.assign(config.externals || {}, {
            '@jupiter/plugin-runtime/i18n': '@jupiter/plugin-runtime/i18n',
            '@jupiter/plugin-runtime': '@jupiter/plugin-runtime',
            dayjs: 'dayjs',
            'react-router': 'react-router',
            'react-router-dom': 'react-router-dom',
            dompurify: {
              commonjs: 'dompurify',
            },
            '@byted-zephyr/design-token': {
              commonjs: '@byted-zephyr/design-token',
            },
            'styled-components': {
              commonjs: 'styled-components',
            },
            '@m4b-design/config-provider': {
              commonjs: '@m4b-design/config-provider',
            },
            '@arco-design/web-react': {
              commonjs: '@arco-design/web-react',
            },
          });

          // garfish subapp error fix: https://bytedance.feishu.cn/wiki/wikcnICLJsGJT4u5oBKGhCCXRLc
          appendPlugins([
            new webpack.BannerPlugin({
              banner: 'Micro front-end',
            }),
            new webpack.IgnorePlugin({
              resourceRegExp: /^\.\/locale$/,
              contextRegExp: /moment$/,
            }),
            new MultiSubAppEntryGeneratorPlugin({
              configMap: iniConfig.multiEntry.getConfig(),
            }),
          ]);
        },
        babel: (babelConfig, { addPlugins, addIncludes, removePlugins }) => {
          removePlugins(['babel-plugin-import']);
        },
      },
    },
    overrideConfig,
  );
  return config;
};

module.exports = {
  get: getBaseConfig,
};
