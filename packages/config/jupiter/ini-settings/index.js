const path = require('path');
const theme = require('./themes');
const locales = require('./locales');
const multiEntry = require('./multi-entrty');

module.exports = {
  theme,
  localesGetter: locales,
  multiEntry,
  injectedJs: {
    common: path.resolve(__dirname, './injected-js/common.js'),
    // priceLib: path.resolve(__dirname, './injected-js/price-lib.js'),
  },
};
