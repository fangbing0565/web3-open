// must in first line, init build env
const env = require('./buildEnv');

exports.env = env;
exports.subAppConfig = require('./subapp.config.js');
exports.mainAppConfig = require('./mainapp.config.js');
exports.configMerge = require('../utils/configMerge');

exports.featParts = require('./feat-configs');
exports.iniConfig = require('./ini-settings');
