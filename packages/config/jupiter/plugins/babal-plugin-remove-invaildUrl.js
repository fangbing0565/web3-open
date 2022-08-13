const DEFAULT_REMOVE_RANGE =
  /boe\.byted\.org|boei18n\.byted\.org|\.snssdk\.com|\.pstatp\.com|\.bytedance\.net|\.bytedance\.com|s16\.tiktokcdn\.com/;
module.exports = function ({ types: t }) {
  return {
    name: 'remove-string',
    visitor: {
      StringLiteral(path, state) {
        const { test = DEFAULT_REMOVE_RANGE } = state.opts;
        const { value } = path.node;
        if (test.test(value)) {
          // eslint-disable-next-line no-console
          console.log(
            '\nremove-string match:',
            value.match(test)[0],
            state.file.opts.filename,
          );
          const newString = value.replace(
            new RegExp(DEFAULT_REMOVE_RANGE, 'g'),
            '',
          );
          path.replaceWith(t.StringLiteral(newString));
        }
      },
    },
  };
};
