const { generateSlardar, generateIpolyfill } = require('../htmlSnippets');
const { multiEnv } = require('./env');

module.exports = idc => {
  return {
    common: {
      app_name: 'TTS',
      favicon: 'assets/favicon/tts.ico',
      tea: {
        app_id: 4068,
        channel: idc.idc_name,
      },
      starling: {
        zoneHost: idc.starling_host,
        // TEAChannelDomain: idc.tea_host,
        defaultLocale: 'en',
        i18nOptions: {
          fallbackLng: 'en',
          supportedLngs: ['en'],
          interpolation: {
            defaultVariables: {
              CHANNEL: 'TikTok',
              PLATFORM: 'TikTok Parter Center',
            },
          },
        },
      },
      snippets: [generateSlardar()],
    },
    regions: [
      {
        region_name: 'CB',
        app_id: 4068,
        account_subject_app_id: 7764,
        starling: {
          i18nOptions: {
            supportedLngs: ['en', 'id-CB'],
          },
        },
        tt_oauth: multiEnv({
          boe: {
            client_key: 'aw26hxc3x285ko2d',
            platform_app_id: '200161',
          },
          online: {
            client_key: 'awn32gkr1d27lv49',
            platform_app_id: '1341',
          },
        }),
        snippets: [generateIpolyfill({ cdnRegion: 'sg' })],
      },
    ],
  };
};
