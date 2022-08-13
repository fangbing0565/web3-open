const common = require('./common.part');
const tailwind = require('./tailwind.part');
const style = require('./style.part');
const rmInvalidStr = require('./rmInvalidStr.part');
const importDeal = require('./importDeal.part');
const replaceSomeModules = require('./replaceSomeModules.part');
const analyze = require('./analyze.part');
const proxy = require('./proxy');

module.exports = {
  common,
  tailwind,
  style,
  rmInvalidStr,
  importDeal,
  replaceSomeModules,
  analyze,
  proxy,
};
