const glob = require('glob');
const tailwindConfig = require('../../tailwind.config');

module.exports = function tailwindPart() {
  return {
    source: {
      designSystem: tailwindConfig.theme,
    },
    tools: {
      tailwindcss: {
        mode: 'jit',
        purge: {
          enabled: true, //  process.env.NODE_ENV === 'production',
          content: [
            './config/html/**/*.(html|ejs|hbs)',
            // src folder exclude api
            ...glob.sync('./@(src|expose){/!(api)/**/*,/*}.@(tsx|ts|js|jsx)'),
            // components folder exclude node_modules
            ...glob.sync(
              './node_modules/@i18n-TTSPC/@(components|*exp*){/!(api|node_modules)/**/*,/*}.@(tsx|ts|js|jsx)',
            ),
          ],
          layers: ['utilities'],
        },
        plugins: tailwindConfig.plugins,
      },
    },
  };
};
