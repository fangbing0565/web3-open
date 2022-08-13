const path = require('path');
module.exports = fallbackLng => {
  return require(path.resolve(__dirname, `./langs/web/${fallbackLng}.json`));
};
