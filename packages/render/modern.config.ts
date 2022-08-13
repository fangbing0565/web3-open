// @ts-nocheck
import { defineConfig } from '@modern-js/module-tools';

// https://modernjs.dev/docs/apis/config/overview
const path = require('path');
const packageInfo = require('./package.json');
const versionInfo = 'V' + packageInfo.version.toUpperCase();

export default defineConfig({
  tools: {
    speedy(config) {
      config.globals = {
        react: 'react',
        'react-dom': 'reactDom',
        '@arco-design/web-react/dist/arco.min.js': 'webReact',
      }
    },
  },
  output: {
    buildConfig: [
      {
        buildType: 'bundle',
        sourceMap: false,
        target: 'es6',

        bundleOptions: {
          skipDeps: false,
          // minify: 'terser',
          // externals: ['react', 'react-dom', '@arco-design/web-react'],
          entry: {
            // 'index.min': './src/index.ts'
            [versionInfo]: './src/index.ts',
          },
        },
        outputPath: './umd',
        format: 'umd',
      },
      {
        buildType: 'bundleless',
        format: 'esm',
        target: 'es6',
        outputPath: './lib',
      },
      {
        enableDts: true,
        dtsOnly: true,
        outputPath: './types',
      },
    ],
  },
});
