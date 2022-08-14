const { mainAppConfig } = require('@oec-open/ttspc-config/jupiter/index');

module.exports = mainAppConfig.get('main', {
  mockSubApp: true,
  overrideConfig: {
    tools: {
      devServer: {
        '/passport/': {
          target: 'https://oec-open-portal-boe.byteintl.net/',
          changeOrigin: true,
          onProxyRes(proxyRes, req, res) {
            const resCookies = proxyRes.headers['set-cookie'];
            if (resCookies) {
              const newCookies = resCookies.map(c =>
                c.replace('Domain=byteintl.net;', ''),
              );
              proxyRes.headers['set-cookie'] = newCookies;
            }
          },
        },
        proxy: {
          '/passport/': {
            target: 'https://oec-open-portal-boe.byteintl.net/',
            changeOrigin: true,
            onProxyRes(proxyRes, req, res) {
              const resCookies = proxyRes.headers['set-cookie'];
              if (resCookies) {
                const newCookies = resCookies.map(c =>
                  c.replace('Domain=byteintl.net;', ''),
                );
                proxyRes.headers['set-cookie'] = newCookies;
              }
            },
          },
          '/api/**': {
            target: 'https://oec-partner-boe.byteintl.net/',
            changeOrigin: true,
            onProxyReq: function (proxyReq, req, res) {
              proxyReq.setHeader(
                'origin',
                'https://oec-partner-boe.byteintl.net',
              );
              proxyReq.setHeader(
                'referer',
                'https://oec-partner-boe.byteintl.net/',
              );
            },
          },
          '/wsos_v2/': {
            target: 'https://oec-partner-boe.byteintl.net/',
            changeOrigin: true,
          },
          '/*.js': {
            target: 'https://oec-partner-boe.byteintl.net/',
            changeOrigin: true,
          },
        },
      },
    },
  },
});
