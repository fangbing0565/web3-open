const baseConfig = require('@oec-open/ttspc-config/ferry.base');

const resConfig = Object.assign(
  baseConfig,
  {
    idlFetchs: [
      {
        ...baseConfig.idlFetchs[0],
        // Edit glob string here to filter IDL domain involved
        entry: './**/@(product|multimedia|review|trade|seller)/**/*api.proto',
      }
    ]
  }
);

module.exports = resConfig;
