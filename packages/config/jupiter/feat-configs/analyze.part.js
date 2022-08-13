const { StatsWriterPlugin } = require('webpack-stats-plugin');
const { IS_ANALYZE } = require('../buildEnv.js');
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

/* const smp = new SpeedMeasurePlugin({
  disable: !analyze,
  outputFormat: 'humanVerbose',
  loaderTopFiles: 2,
  granularLoaderData: true,
}); */
module.exports = function analyzePart() {
  if (!IS_ANALYZE) {
    return {};
  }
  return {
    tools: {
      webpack: (config, { appendPlugins }) => {
        appendPlugins([
          new StatsWriterPlugin({
            filename: 'stats.json', // Default
            fields: ['modules'],
            transform(data) {
              return JSON.stringify(
                {
                  modules: data.modules.map(m => {
                    return {
                      id: m.id,
                      identifier: m.identifier,
                      reasons: m.reasons.map(r => {
                        return {
                          moduleId: r.moduleId,
                          moduleIdentifier: r.moduleIdentifier,
                        };
                      }),
                    };
                  }),
                },
                null,
                2,
              );
            },
          }),
        ]);
      },
    },
  };
};
