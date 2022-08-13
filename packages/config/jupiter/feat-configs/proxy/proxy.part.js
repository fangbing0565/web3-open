const fs = require('fs');
const path = require('path');
const axios = require('axios');
const {
  PROJECT_ROOT,
  WORKSPACE_ROOT,
  PATH,
  IS_DEV,
  IS_PROXY,
} = require('../../buildEnv');
const jupiterHooksPlugin = require('../../plugins/jupiter-hooks-plugin');
const {
  isEnableWhistle,
  keepProxyAlive,
  closeEveryProxy,
} = require('./whistleManager');

const LOCAL_PROXY_PATH = path.resolve(PROJECT_ROOT, '.proxy');
const LOCAL_APPS_PATH = path.resolve(PROJECT_ROOT, 'apps');
const APP_PROXY_PATH = path.resolve(PROJECT_ROOT, './node_modules/.proxy');
const HTML_ENTRY_INJECT_PATH = path.resolve(
  APP_PROXY_PATH,
  'proxy-for-html.js',
); // injected some js to html entry
const SUB_APP_PROXY = path.resolve(APP_PROXY_PATH, 'proxy-for-sub.json');

const idc = process.env.LOCAL_DEVELOP_IDC === 'va' ? 'va' : 'sg';

const DEFAUL_HTML = `index.${idc}_tts_cb.html`;
const DOMAIN_LIST = {
  'oec-partner-boe.byteintl.net': `index.${idc}_tts_cb.html`,
};
const DOMAINS = Object.keys(DOMAIN_LIST);

// exclude all tlb path for server logic
const excludePath = new RegExp(
  '.net/(api(?!/goofy/get-garr-mod-list)|chat|passport|ttwid|feedback|pssresource|wsos_v2|garrmodlistv3)',
).toString();

let defaultProxyRule = {
  '*': `whistle.rules_watcher://${LOCAL_PROXY_PATH},${APP_PROXY_PATH}`,
  ...DOMAINS.reduce((pry, domain) => {
    pry[
      domain
    ] = `jsAppend://${HTML_ENTRY_INJECT_PATH} includeFilter://resH:content-type=text/html`;
    return pry;
  }, {}),
};

function proxyPartForMain(port, appName = 'main', mockSubApp) {
  if (!IS_DEV) {
    return {};
  }
  let mockSubText = '';
  if (mockSubApp) {
    // 获取所有子应用，生成mock数据
    emitInjectSubApp(SUB_APP_PROXY, LOCAL_APPS_PATH);
    mockSubText = `oec-partner-boe.byteintl.net/garrmodlistv3 file://${SUB_APP_PROXY}`;
  }
  // rules1 for static, eg: https://lf16-scmcdn.oecstatic.com/obj/goofy-sg/i18n/ecom/FANS/unihan/finance/static/js/606.74e0cca7.js ，
  // because boe and online cdn location is the same, rules1 will use referer to filter
  // rules2 for static exclude current app, try to fix fans-cb and byteintl get cdn from normal -> unihan
  // rules3 for html entry, use x-host to go to the realUrl
  const clearProxy = emitAppProxy({
    appName,
    proxyPriority: '0',
    content: `^**/obj/archi-sg/18n/ecom/partner_center/**/${appName}/static/** localhost:${port}/${appName}/static/$3 includeFilter://h:referer=/boe/ includeFilter:///\\.map$/
^**/obj/archi-sg/18n/ecom/partner_center/obj/archi-sg/18n/ecom/partner_center/**/normal/** $1/obj/archi-sg/18n/ecom/partner_center/$2/unihan/$3 includeFilter://h:referer=/(fans|byteintl)/ includeFilter:///\\.map$/
${mockSubText}
${DOMAINS.map(
  domain =>
    // eslint-disable-next-line
    `${domain} localhost:${port} reqHeaders://\`x-host=\${url.host}\` excludeFilter:///.*\.js/ excludeFilter://${excludePath}`,
).join('\n')}
    `,
  });

  const localProxy = {
    '***/api/goofy/get-garfish-app-list': `file://${SUB_APP_PROXY}`,
  };

  return {
    server: {
      port,
    },
    dev: {
      proxy: IS_PROXY ? defaultProxyRule : undefined,
      https: IS_PROXY ? true : false,
    },
    plugins: [
      jupiterHooksPlugin({
        afterDev: () => {
          if (IS_PROXY) {
            keepProxyAlive();
          }
        },
        beforeExit: () => {
          if (IS_PROXY) {
            closeEveryProxy();
            clearProxy();
          }
        },
      }),
    ],
  };
}

function proxyPartForSub(port, appName, enableMock = false) {
  if (!IS_DEV) {
    return {};
  }
  // rules1 for static, eg: https://lf16-scmcdn.oecstatic.com/obj/goofy-sg/i18n/ecom/FANS/unihan/finance/static/js/606.74e0cca7.js ，
  // because boe and online cdn location is the same, rules1 will use referer to filter
  // rules2 for garModule entry， eg: https://tosv.boei18n.bytedance.net/obj/goofy-boei18n/gftar/i18n/ecom/ttspc/account/1.0.0.6878/FANS/unihan/account.sg_fans_cb.js
  const clearProxy = emitAppProxy({
    appName,
    enableMock,
    content: `^**/obj/archi-sg/18n/ecom/partner_center/**/${appName}/static/** localhost:${port}/${appName}/static/$3 includeFilter://h:referer=/boe/ includeFilter:///\.map$/
    ^***/${appName}*.js https://localhost:${port}/${appName}.js includeFilter://h:referer=/boe/`,
  });
  if (!IS_PROXY) {
    addSubAppSourceUrl(port, appName);
  }

  const config = {
    server: {
      port,
    },
    plugins: [
      jupiterHooksPlugin({
        afterDev: () => {
          if (IS_PROXY) {
            keepProxyAlive();
          }
        },
        beforeExit: () => {
          if (IS_PROXY) {
            closeEveryProxy();
            clearProxy();
          }
        },
      }),
    ],
    dev: {
      proxy: IS_PROXY ? defaultProxyRule : null,
      https: IS_PROXY ? true : false,
    },
  };

  return config
}

if (IS_DEV) {
  initProxy();
}

module.exports = {
  forMain: proxyPartForMain,
  forSub: proxyPartForSub,
};

function initProxy() {
  if (!fs.existsSync(APP_PROXY_PATH)) {
    fs.mkdirSync(APP_PROXY_PATH);
    emitInjectHtml();
  }
  if (!fs.existsSync(LOCAL_PROXY_PATH) && IS_PROXY) {
    fs.writeFileSync(
      LOCAL_PROXY_PATH,
      `
#You can add your own (whistle)proxy here
#https://magellan-boe.bytedance.net/garr/modules/list http://localhost:3099/mock/module-lists.json
#^**/obj/archi-sg/18n/ecom/partner_center/**/product/static/** localhost:3103/product/static/$3 includeFilter://h:referer=/boe/ includeFilter:///\\.map$/
#^***/product*.js http://localhost:3103/product.js includeFilter://h:referer=/boe/
`,
    );
  }
}

function emitInjectHtml({ appendContent, isDelAppendContent = false } = {}) {
  if (!IS_PROXY) {
    return;
  }
  const appendPosition = '//appendPosition\n';
  let injectHtmlContent = `
    const __gar_mock_data__ = [];
    ${appendPosition}

    // to use gfUrl to fix the sourceUrl(cdn url) has cache problem
    if (window?.gfdatav1?.garrModules?.data?.length) {
      window.gfdatav1.garrModules.data = window.gfdatav1.garrModules.data.map(garM => ({...garM}))
      window.gfdatav1.garrModules.data.push(...__gar_mock_data__);
    }
  `;
  if (fs.existsSync(HTML_ENTRY_INJECT_PATH)) {
    // will use file content
    injectHtmlContent = fs.readFileSync(HTML_ENTRY_INJECT_PATH).toString();
  }

  if (appendContent) {
    if (isDelAppendContent) {
      injectHtmlContent = injectHtmlContent.replace(appendContent, '');
    } else {
      // append content in position
      injectHtmlContent = injectHtmlContent.replace(
        appendPosition,
        `
      ${appendPosition}
      ${appendContent}
    `,
      );
    }
  }
  fs.writeFileSync(HTML_ENTRY_INJECT_PATH, injectHtmlContent);
}
function getAllDirs(mypath) {
  const items = fs.readdirSync(mypath);
  const result = [];
  // 遍历当前目录中所有的文件和文件夹
  items.map(item => {
    if (item !== 'main') {
      const temp = path.join(mypath, item);
      // 若当前的为文件夹
      if (fs.statSync(temp).isDirectory()) {
        result.push(item); // 存储当前文件夹的名字
      }
    }
  });
  return result;
}
function emitInjectSubApp(appName, appsRoot) {
  const subApps = getAllDirs(appsRoot);
  const text = {
    code: 0,
    data: [],
  };
  subApps.forEach(item => {
    text.data.push({
      name: item,
      source_url: `/${item}.js`,
      entry: `/${item}.js`,
      path: `/${item}`,
      activeWhen: `/${item}`
    });
  });
  fs.writeFileSync(appName, JSON.stringify(text, null, '\t'));
}
function getSubModulesApp(appName) {
  try {
    const value = fs.readFileSync(appName, {
      encoding: 'utf8',
      flag: 'r',
    });
    return value;
  } catch (e) {
    return null;
  }
}

function addSubAppSourceUrl(port, appName) {
  let submodule = getSubModulesApp(SUB_APP_PROXY);
  if (!submodule) {
    throw new Error('you muse run "pnpm dev main"');
  }
  let isHas = false;
  try {
    let data = JSON.parse(submodule);
    data.data = data.data.map(value => {
      if(value.name === appName) {
        isHas = true;
        value.source_url = `http://localhost:${port}/${appName}.js`
        value.entry = `http://localhost:${port}/${appName}.js`
      }
      return value
    })
    if (!isHas) {
      data.data.push({
        "name": appName,
        "source_url": `http://localhost:${port}/${appName}.js`,
        "path": `/${appName}`,
        "activeWhen": `/${appName}`,
        "entry": `http://localhost:${port}/${appName}.js`,
      })
    }
    fs.writeFileSync(SUB_APP_PROXY, JSON.stringify(data, null, '\t'));
  } catch(e) {
    throw new Error(e);
  }
}

function emitAppProxy({
  appName,
  content,
  enableMock = false,
  proxyPriority = '1',
}) {
  if (!IS_PROXY) {
    return;
  }
  const appProxyPath = path.resolve(
    APP_PROXY_PATH,
    `${appName}.${proxyPriority}.proxy`,
  );
  fs.writeFileSync(appProxyPath, content);

  let mockContent;
  if (enableMock) {
    const mockContent = `__gar_mock_data__.push({name: "${appName}", source_url: '/${appName}.js'})`;
    emitInjectHtml({ appendContent: mockContent });
  }

  return () => {
    fs.rmSync(appProxyPath);
    if (enableMock && mockContent) {
      emitInjectHtml({ appendContent: mockContent, isDelAppendContent: true });
    }
  };
}
