module.exports = function importDealPart({ disableDefault = true } = {}) {
    return {
      tools: {
        babel: (
          babelConfig,
          { removePlugins, addPlugins /* , addIncludes */ },
        ) => {
          if (disableDefault) {
            removePlugins(['babel-plugin-import']);
          }
          addPlugins([
            [
              'import',
              {
                libraryName: '@byted/hooks',
                libraryDirectory: 'lib',
                camel2DashComponentName: false,
              },
              '@byted/hooks',
            ],
            [
              'import',
              {
                libraryName: '@arco-design/web-react/icon',
                libraryDirectory: 'react-icon',
                camel2DashComponentName: false,
              },
              'import-arcodesign-icon',
            ],
          ]);
        },
      },
    };
  };
  