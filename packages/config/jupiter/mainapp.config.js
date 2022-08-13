const glob = require('glob');
const { omit } = require('lodash');
const { RawSource } = require('webpack-sources');
const handlebars = require('handlebars');
const configMerge = require('../utils/configMerge');
const { PATH, IS_DEV, IS_PROXY } = require('./buildEnv');
const featParts = require('./feat-configs');
const iniConfig = require('./ini-settings');
const initPort = require('./lsof');
const modifyEntryHtml = require('./plugins/modifyEntryHtml');
const {
  MultiHtmlEntryWebpackPlugin,
} = require('./plugins/multi-entry-webpack-plugin');

const defaultOption = {
  devPort: 3100,
  masterAppConfig: {},
  overrideConfig: {},
};

/**
 * main app jupiter config
 * @param {String} moduleName module name
 * @param {Object} option base config options
 * @param {Number} option.devPort options port
 * @param {Boolean} option.masterAppConfig is micro fe open
 * @param {Object} option.overrideConfig options override
 * @param {Object} option.multiEntryConfig options multi entry config
 * @param {Boolean} option.mockSubApp mock sub app
 * @returns {Object} option
 */
function getBaseConfig(moduleName, option = defaultOption) {
  const {
    devPort = 3100,
    masterAppConfig = {},
    overrideConfig = {},
    multiEntryConfig,
    mockSubApp = false,
  } = option;
  initPort(devPort);
  const featConfigs = configMerge(
    featParts.common(moduleName),
    featParts.tailwind(),
    featParts.style(),
    featParts.rmInvalidStr(),
    featParts.importDeal(),
    featParts.replaceSomeModules(),
    featParts.proxy.forMain(devPort, moduleName, mockSubApp),
    featParts.analyze(),
  );

  const config = configMerge(
    featConfigs,
    {
      runtime: {
        features: {
          state: false,
          router: true,
          tea: true,
          i18next: {
            zoneHost: '',
          },
          masterApp: masterAppConfig,
        },
      },
      plugins: [
        modifyEntryHtml(),
      ],
      tools: {
        webpack: (config, { appendPlugins }) => {
          /**
           * 全局样式包
           */
          const uiLibCss = [
            // arco
            ...glob.sync(
              './node_modules/@arco-design/web-react/es{/*/style/index.js,/style/index.less}',
            ),
          ];
          const ArcoWebpackPlugin = require('@arco-design/webpack-plugin');
          config.entry.main = [
            iniConfig.injectedJs.common,
            // iniConfig.injectedJs.priceLib,
            ...uiLibCss,
          ].concat(config.entry.main);

          appendPlugins([
            new ArcoWebpackPlugin({
              iconBox: '@arco-design/iconbox-react-m4b-seller',
              removeFontFace: true,
              defaultLanguage: 'en-US',
              style: false,
            }),
          ]);
          appendPlugins([
            new MultiHtmlEntryWebpackPlugin({
              configMap: iniConfig.multiEntry.getConfig(multiEntryConfig),
              /** @param options {{html: string, config: AppConfig }} */
              htmlReplaceCallback({ html, config, compilation } = {}) {
                // step1: emit fallback starling use did
                const { fallbackLng } = config.starling.i18nOptions;
                const starling = JSON.stringify({
                  [fallbackLng]: {
                    i18n_ttspc_fe: iniConfig.localesGetter(fallbackLng),
                  },
                });
                const script = `window.__TTSPC_STARLING__=${starling}`;
                const hash = require('crypto')
                  .createHash('md5')
                  .update(script)
                  .digest('hex')
                  .substr(0, 8);
                const filename = `${moduleName}/static/js/starling.${hash}.js`;
                compilation.emitAsset(filename, new RawSource(script));
                const starlingUrl = `${PATH.PUBLIC_URL}${filename}`;

                // step2: replaceHtml
                const { idc, snippets, favicon } = config;
                const runtime = omit(config, ['snippets']);
                let content = handlebars.compile(html, { noEscape: true })({
                  cdn_assets_host: idc.cdn_assets_host,
                  ttspc_app_envs:
                    iniConfig.multiEntry.htmlSnippet.generateEnvs(runtime),
                  runtime_code_snippets: snippets.join(''),
                });

                // Inject Starling Script.
                function escape(string) {
                  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                }
                content = content.replace(
                  new RegExp(
                    `(${escape('<!--<?- bottomTemplate ?>-->')})`,
                    'g',
                  ),
                  `$1<script crossorigin="anonymous" src="${starlingUrl}"></script>`,
                );

                // Replace favicon.ico
                content = content.replace(
                  'favicon.ico',
                  PATH.PUBLIC_URL + favicon,
                );

                if (!(IS_DEV && !IS_PROXY)) {
                  // Finally, Replace Public Path Host.
                  content = content.replace(
                    new RegExp(`(${PATH.PUBLIC_URL_PREFIX})`, 'g'),
                    `${idc.cdn_assets_host}$1`,
                  );
                }

                return content;
              },
            }),
          ]);
        },
      },
    },
    overrideConfig,
  );
  return config;
}

module.exports = {
  get: getBaseConfig,
};
