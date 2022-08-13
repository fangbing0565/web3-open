const { IS_DEV } = require('../buildEnv');
var modifyEntryHtml = option => ({
  name: 'modifyEntryHtml',
  setup(api) {
    return {
      modifyServerRoutes({ routes }) {
        return {
          routes: [
            ...routes.map(value => {
              if (IS_DEV) {
                if (value.urlPath === '/') {
                  value.entryPath = 'html/main/index.sg_tts_cb.html'
                }
              }
              return value
            }),
          ],
        };
      }
    }
  },
});

module.exports = modifyEntryHtml;
