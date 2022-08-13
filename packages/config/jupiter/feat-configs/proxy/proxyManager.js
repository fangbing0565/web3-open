const shelljs = require('shelljs');

const networkTypes = ['Ethernet', 'Thunderbolt Ethernet', 'Wi-Fi'];

const proxyManager = {};

proxyManager.getNetworkType = () => {
  for (let i = 0; i < networkTypes.length; i++) {
    const type = networkTypes[i];
    const result = shelljs.exec(`networksetup -getwebproxy ${type}`, {
      silent: true,
    }).code;

    if (result === 0) {
      proxyManager.networkType = type;
      return type;
    }
  }

  throw new Error('Unknown network type');
};

proxyManager.enableGlobalProxy = (ip, port) => {
  if (!ip || !port) {
    // eslint-disable-next-line no-console
    console.log(
      'failed to set global proxy server.\n ip and port are required.',
    );
    return;
  }

  const networkType = proxyManager.networkType || proxyManager.getNetworkType();
  // && networksetup -setproxybypassdomains ${networkType} 127.0.0.1 localhost
  shelljs.exec(`networksetup -setwebproxy ${networkType} ${ip} ${port}`);
  shelljs.exec(`networksetup -setsecurewebproxy ${networkType} ${ip} ${port}`);
};

proxyManager.disableGlobalProxy = () => {
  const networkType = proxyManager.networkType || proxyManager.getNetworkType();

  shelljs.exec(`networksetup -setwebproxystate ${networkType} off`);
  shelljs.exec(`networksetup -setsecurewebproxystate ${networkType} off`);
};

module.exports = proxyManager;
