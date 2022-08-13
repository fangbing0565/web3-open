const SlardarWebpackPlugin = require('@slardar/webpack-plugin');
const { GoofyPlugin } = require('@byted/goofy_plugin');
const { SizeLimitPlugin } = require('@perfkit/size-limit-webpack');
const {
  BUILD_INFO,
  DEVELOP_ENV,
  IS_ONLINE,
  IS_PROD,
  IS_DEV,
  IS_ANALYZE,
  IS_SCM_BUILD,
  PATH,
} = require('../buildEnv.js');

/**
 * 公共配置
 * @param {*} moduleName
 * @returns
 */
module.exports = function commonPart(moduleName) {
  return {
    source: {
      moduleScopes: ['./expose'],
      include: [
        /@i18n-ttspc\/(hooks|ttspc-static|ttspc-internal|components|utils|ttspc-kits|ttspc-render|ttspc-bridge)\/.*/,
        /@ecom\/(lib_types)\/.*/,
      ],
      // similar webpack.DefinePlugin
      globalVars: {
        DEVELOP_ENV,
        BUILD_INFO: {
          ...BUILD_INFO,
          app_name: moduleName,
        },
        IS_BOE: !IS_ONLINE,
        IS_ONLINE,
        IS_DEV,
        IS_PROD,
      },
    },
    output: {
      disableCssModuleExtension: true,
      polyfill: 'entry',
      publicUrl: PATH.PUBLIC_URL,
      path: PATH.DIST_PATH,
      jsPath: `${moduleName}/static/js`,
      cssPath: `${moduleName}/static/css`,
      mediaPath: `${moduleName}/static/media`,
      scriptExt: {
        custom: {
          test: /\.js$/,
          attribute: 'crossorigin',
          value: 'anonymous',
        },
      },
    },
    dev: {
      // disableTsChecker: true,
      assetPrefix: PATH.PUBLIC_URL,
    },
    // plugins: [[path.resolve(__dirname, '../../config/restartPlugin.js')]],
    tools: {
      webpack: (config, { appendPlugins }) => {
        // replace dayjs to moment for arco ui library
        config.resolve.alias.dayjs$ = 'moment-timezone';

        // dynamic CDN: https://bytedance.feishu.cn/docs/doccnVHoF7lwnfFzHbvn7Wfgtof
        // appendPlugins([new GoofyPlugin()]);

        if (IS_PROD) {
          config.devtool = 'hidden-source-map';
          // upload slardar sourcemap
          !IS_ANALYZE &&
            appendPlugins([
              new SlardarWebpackPlugin({
                bid: 'tts_partner_center',
                include: [PATH.DIST_PATH],
                release: '',
                clear_after_upload: true,
              }),
            ]);
        }
        if (IS_SCM_BUILD) {
          appendPlugins([
            new SizeLimitPlugin({
              assetsFilter: path => {
                return !/[\\/]cache[\\/]/.test(path);
              },
            }),
          ]);
        }
      },
      // terser: {
      //   terserOptions: {
      //     compress: {
      //       drop_console: IS_PROD,
      //       pure_funcs: ['console.log'],
      //     },
      //   },
      // },
    },
  };
};
