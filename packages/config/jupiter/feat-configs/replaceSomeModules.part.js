module.exports = function replaceSomeModulesPart() {
    return {
      tools: {
        webpack: (config, { webpack, appendPlugins }) => {
          appendPlugins([
            new webpack.NormalModuleReplacementPlugin(
              /@arco-design\/web-react\/es\/locale\/default\.js/,
              './en-US.js',
            ),
            new webpack.NormalModuleReplacementPlugin(
              /dayjs\/locale\/zh-cn\.js/,
              './en.js',
            ),
          ]);
        },
      },
    };
  };
  