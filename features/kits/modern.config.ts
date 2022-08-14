import { defineConfig } from '@jupiter/module-tools';

const ArcoWebpackPlugin = require('@arco-design/webpack-plugin');
// https://jupiter.goofy.app/api/config
export default defineConfig({
  tools: {
    babel: (babelConfig, { addPlugins, addIncludes, removePlugins }) => {
      // 移除掉默认对arco的按需加载，见https://jupiter.goofy.app/guide/troubleshooting/cli/auto-import#%E5%9C%BA%E6%99%AF
      removePlugins(['babel-plugin-import']);
    },
    webpack: (config, { webpack, appendPlugins }) => {
      appendPlugins([
        new ArcoWebpackPlugin({
          iconBox: '@arco-design/iconbox-react-m4b-seller',
          removeFontFace: true,
          defaultLanguage: 'en-US',
          style: false,
        }),
      ]);
    },
  },
});
