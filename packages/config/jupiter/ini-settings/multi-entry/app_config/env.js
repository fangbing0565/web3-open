const { IS_ONLINE } = require('../../../buildEnv');

module.exports = {
  multiEnv({ boe, online }) {
    if (IS_ONLINE) {
      return online;
    }

    return boe;
  },
};
