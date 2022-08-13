const path = require('path');
const shelljs = require('shelljs');
const proxyManager = require('./proxyManager');
const {
  IS_PROXY,
  PROJECT_ROOT
} = require('../../buildEnv');

const HEART_BEATS = 10000; // 5s
const w2Bin = path.resolve(
  path.dirname(require.resolve('whistle')),
  'bin/whistle.js',
);

function isEnableWhistle() {
  const res = shelljs.exec(`${w2Bin} status`, { silent: true });
  return Boolean(~res.toString().indexOf('8899')); // just check 8899 port
}

function enableWhistle() {
  shelljs.exec(`${w2Bin} start -p 8899`);
}

function disableWhistle() {
  shelljs.exec(`${w2Bin} stop`);
}

function keepProxyAlive() {
  if (IS_PROXY) {
    setInterval(() => {
      if (!isEnableWhistle()) {
        proxyManager.enableGlobalProxy('127.0.0.1', '8899');
        enableWhistle();
      }
    }, HEART_BEATS);
  } else {
    proxyManager.enableGlobalProxy('127.0.0.1', '8899');
  }

}

function closeEveryProxy() {
  proxyManager.disableGlobalProxy();
  disableWhistle();
}

module.exports = { isEnableWhistle, keepProxyAlive, closeEveryProxy };
