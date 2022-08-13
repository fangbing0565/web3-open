module.exports = {
    extends: ['stylelint-config-prettier'],
    plugins: ['stylelint-prettier'],
    rules: {
      'prettier/prettier': [
        true,
        {
          singleQuote: true,
        },
      ],
      // 'font-family-name-quotes': 'always-where-required',
      'selector-no-qualifying-type': [
        true,
        {
          ignore: ['attribute', 'class', 'id'],
        },
      ],
    },
  };
  