const path = require('path');
const { IS_PROD, BUILD_ASPECT_UNIHAN, IS_ONLINE } = require('../buildEnv.js');

module.exports = function rmInvalidStrPart({
  isRemoveInvalidUrl = IS_ONLINE,
} = {}) {
  if (!IS_PROD) {
    return {};
  }
  return {
    tools: {
      webpack: config => {
        // boe may have some ch domain, remove when online
        const babelPlugins = isRemoveInvalidUrl
          ? [[require('../plugins/babal-plugin-remove-invalidUrl'), {}]]
          : [];
        if (!BUILD_ASPECT_UNIHAN) {
          // TODO: 移除第三方库中字符串里的中文
          // 但由于日文会包含中文的code，所以对于日文处理会有问题
          // babelPlugins.push([
          //   '@i18n-ecom/babel-plugin-remove-word',
          //   {
          //     debugFile: path.join(process.cwd(), 'word.txt'),
          //     debugLibs: [],
          //     libs: [
          //       'common-login-i18n-sdk',
          //       '@arco-design/web-react',
          //       '@jupiter-app',
          //       '@byted',
          //       'byted-',
          //       'xgplayer',
          //       '@syl-editor',
          //     ],
          //   },
          // ]);
        }
        config.module.rules.push({
          test: /\.js$/,
          include: /node_modules\/(@jupiter|@byted|@ies|@ad|@arco)/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: babelPlugins,
            },
          },
        });
      },
    },
  };
};
