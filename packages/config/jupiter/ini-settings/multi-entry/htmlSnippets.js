module.exports = {
    generateTDK({ domain }) {
      const hrefLangs = {
        'http://oec-partner.byteintl.net': ['en-ID', 'id-ID'],
      };
      const tags = [`<link rel="canonical" href="${domain}" />`];
  
      Object.keys(hrefLangs).forEach(href => {
        const locales = hrefLangs[href];
  
        locales.forEach(locale => {
          tags.push(
            `<link rel="alternate" hreflang="${locale}" href="${href}" />`,
          );
        });
      });
  
      return tags.join('');
    },
    generateGA() {
      return `
    <script crossorigin="anonymous" async src="https://www.googletagmanager.com/gtag/js?id=G-BZBQ2QHQSP"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      // gtag('js', new Date());
      // gtag('config', 'AW-10779019518');
      // gtag('config', 'G-3LWFS57BT7');
      gtag('js', new Date());
      gtag('config', 'G-BZBQ2QHQSP', {
        'linker': {
          'domains': [
            'http://oec-partner.byteintl.net/',
          ]
        }
      });
    </script>
        `;
    },
    generateSecSdk({ protectedDomain, staticUrl }) {
      return `
    <script crossorigin="anonymous" src="${staticUrl}/main/static/js/secsdk.umd.20211028.js"></script>
    <script>
      (function(){
        if (window.secsdk) {
          const protectedDomain = ${JSON.stringify(protectedDomain)};
          var protectedPath = {
            'POST': [
              /\\/api\\/v\\d+\\/seller\\/creator\\/invitation\\/send/,
              /\\/api\\/v\\d+\\/seller\\/account_management\\/invite/,
              /\\/api\\/v\\d+\\/promotion\\/destroy/,
              /\\/api\\/v\\d+\\/product\\/products\\/delete/,
              /\\/api\\/v\\d+\\/seller\\/delivery\\/update/,
            ],
          }
          var protectedConfig = protectedDomain.reduce(function(acc, cur) {
            acc[cur] = protectedPath;
            return acc;
          }, {})
          secsdk.csrf.setProtectedHost(protectedConfig)
        }
      })();
    </script>
        `;
    },
    generateEnvs(envs) {
      return `
    <script>
      window.__TTSPC_APP_ENVS__ = ${JSON.stringify(envs)}
    </script>
        `;
    },
    generateWebmssdk({ dataRegion, cdnRegion }) {
      return `
    <script crossorigin="anonymous" src="https://lf16-secsdk.bitssec.com/obj/rc-web-sdk-${cdnRegion}/webmssdk/1.0.0.174/webmssdk.js"></script>
    <script>
      (() => {
        const LOGIN_MODE = 0x201;
        window.byted_acrawler &&
          window.byted_acrawler.init({
            aid: 4068,
            isSDK: false,
            boe: false,
            region: ${JSON.stringify(dataRegion)},
            mode: LOGIN_MODE,
            enablePathList:  ['/api/*', '/passport/(?!(web/logout)|(sso/login/callback)).'],
          });
      })();
    </script>
        `;
    },
    generateTiktokAnalytics() {
      return `
    <script>
      !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load('C70N19O394AQ13GK2OV0');
      ttq.page();
      }(window, document, 'ttq');
    </script>
        `;
    },
    generateFacebookPixel() {
      return `
    <!-- Facebook Pixel Code -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '449917563413538');
      fbq('track', 'PageView');
    </script>
    <noscript>
      <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=449917563413538&ev=PageView&noscript=1"/>
    </noscript>
    <!-- End Facebook Pixel Code -->
        `;
    },
    generateSlardar() {
      return `
    <script>
      window.__FP_BEGIN__ = Date.now();
    </script>
  
    <script>
      (function installSlardar(w, d, u, b, n, pc, ga, ae, po, s, p, e, t, pp) {pc = 'precollect';ga = 'getAttribute';ae = 'addEventListener';po = 'PerformanceObserver';s = function (m) {p = [].slice.call(arguments);p.push(Date.now(), location.href);(m == pc ? s.p.a : s.q).push(p)};s.q = [];s.p = { a: [] };w[n] = s;e = document.createElement('script');e.src = u + '?bid=' + b + '&globalName=' + n;e.crossorigin = u.indexOf('cdn') > 0 ? 'anonymous' : 'use-credentials';d.getElementsByTagName('head')[0].appendChild(e);if (ae in w) {s.pcErr = function (e) {e = e || w.event;t = e.target || e.srcElement;if (t instanceof Element || t instanceof HTMLElement) {if (t[ga]('integrity')) {w[n](pc, 'sri', t[ga]('href') || t[ga]('src'))} else {w[n](pc, 'st', { tagName: t.tagName, url: t[ga]('href') || t[ga]('src') })}} else {w[n](pc, 'err', e.error)}};s.pcRej = function (e) {e = e || w.event;w[n](pc, 'err', String(e.reason || (e.detail && e.detail.reason)))};w[ae]('error', s.pcErr, true);w[ae]('unhandledrejection', s.pcRej, true);};if('PerformanceLongTaskTiming' in w) {pp = s.pp = { entries: [] };pp.observer = new PerformanceObserver(function (l) {pp.entries = pp.entries.concat(l.getEntries)});pp.observer.observe({ entryTypes: ['longtask', 'largest-contentful-paint','layout-shift'] })}})(window,document,'https://sf16-short-va.bytedapm.com/slardar/fe/sdk-web/browser.maliva.js','tts_partner_center','Slardar');
    </script>
  
    <script>
      try {
        window.addEventListener('load', function () {
          setTimeout(function () {
            var root = document.getElementById('root');
            if (!root || !root.children.length) {
              window.Slardar &&
                window.Slardar('Sentry', function (sentry) {
                  sentry.captureMessage('WhiteScreen');
                });
            }
          }, 3000);
        });
      } catch (e) {}
    </script>
        `;
    },
    generateIpolyfill({ cdnRegion }) {
      return `
          <!-- ipolyfill -->
          <link rel="preconnect" href="//ipolyfill-origin-${cdnRegion}.byteintlapi.com">
          <link rel="dns-prefetch" href="//ipolyfill-origin-${cdnRegion}.byteintlapi.com">
  
          <script
            src="https://ipolyfill-origin-${cdnRegion}.byteintlapi.com/0.0.10/polyfill.min.js"
            crossorigin="anonymous"></script>
          <!-- ipolyfilll -->
        `;
    },
  };
  