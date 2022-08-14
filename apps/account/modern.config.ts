const { subAppConfig } = require('@oec-open/ttspc-config/jupiter/index');

module.exports = subAppConfig.get('account', {
  devPort: 4001,
  enableMockGar: true,
});
