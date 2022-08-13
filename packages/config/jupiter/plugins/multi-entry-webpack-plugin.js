const HtmlWebpackPlugin = require('html-webpack-plugin');
const { RawSource } = require('webpack-sources');

class MultiEntryWebpackPlugin {
  /** @param options {{configMap: {[key in string]: any}, htmlReplaceCallback: ({html: string, config: any, compilation: any, configKey: string}) => string }} */
  constructor(options) {
    this.config_map = options.configMap;
    this.htmlReplaceCallback = options.htmlReplaceCallback;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
      'MultiHtmlEntryGeneratorPlugin',
      compilation => {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
          'MultiHtmlEntryGeneratorPlugin',
          data => {
            Object.entries(this.config_map).forEach(([key, config]) => {
              compilation.emitAsset(
                data.plugin.options.filename.replace(
                  'index.html',
                  `index.${key}.html`,
                ),
                new RawSource(
                  this.htmlReplaceCallback({
                    html: data.html,
                    compilation,
                    config,
                    configKey: key,
                  }),
                ),
              );
            });
          },
        );
      },
    );
  }
}

class MultiSubAppEntryGeneratorPlugin {
  /** @param options {{configMap: {[key in string]: any}}} */
  constructor(options = {}) {
    this.configMap = options.configMap;
  }

  /**
   * @param {import('../../../types/runtime').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.emit.tap('MEntry', compilation => {
      Object.entries(this.configMap).forEach(([key]) => {
        const { name, source, info } = compilation.getAsset(
          compiler.options.output.filename,
        );
        compilation.emitAsset(
          name.replace(/(\w+?)(\.js)/, `$1.${key}$2`),
          source,
          info,
        );
      });
    });
  }
}

module.exports = {
  MultiHtmlEntryWebpackPlugin: MultiEntryWebpackPlugin,
  MultiSubAppEntryGeneratorPlugin,
};
