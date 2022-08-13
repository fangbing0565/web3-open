const { IS_PROD } = require('../buildEnv.js');

module.exports = function stylePart() {
  return {
    tools: {
      webpack: config => {
        const rules = config.module.rules.find(rule =>
          Array.isArray(rule.oneOf),
        ).oneOf;

        // 当前Jupiter不支持extract css
        // 并且打包进去的css没有压缩，还带了sourcemap
        // 问题已反馈Jupiter项目组，在修复前临时在配置中处理
        // use[0]是style-loader
        // use[1]是css-loader
        // use[2]是postcss-loader
        // report error if not in this order
        rules.forEach(rule => {
          if (
            IS_PROD &&
            Array.isArray(rule.use) &&
            rule.use[2] &&
            rule.use[2].loader &&
            rule.use[2].loader.includes('postcss-loader') &&
            rule.use[2].options.plugins
          ) {
            rule.use[2].options.sourceMap = false;
            const rawPlugins = rule.use[2].options.plugins;
            rule.use[2].options.plugins = () => {
              return [
                ...rawPlugins(),
                require('cssnano')({
                  preset: [
                    'default',
                    {
                      mergeRules: false,
                    },
                  ],
                }),
              ];
            };
          }
          if (
            Array.isArray(rule.use) &&
            rule.use[1] &&
            rule.use[1].loader &&
            rule.use[1].loader.includes('css-loader')
          ) {
            rule.use[1].options.sourceMap = false;

            // exclude but one https://github.com/webpack/webpack/issues/2031but in feature @i18n-ecom-seller
            if (rule.exclude) {
              const newExclude = Array.isArray(rule.exclude)
                ? [...rule.exclude]
                : [rule.exclude];
              // exclude path like ../node_modules/.pnpm/xx/node_modules/2333
              rule.exclude = newExclude.map(ex =>
                ex.toString() === '/node_modules/'
                  ? /node_modules\/(?!.pnpm)(?!@i18n-ttspc\/(hooks|assets|region-config|components|utils|styles))/
                  : ex,
              );
            }

            // if (rule.use[1].options.modules) {
            //   rule.use.splice(1, 0, {
            //     loader: require.resolve('css-modules-typescript-loader'),
            //     options: {
            //       mode: 'verify',
            //     },
            //   });
            // }
          }
        });
      },
    },
  };
};
