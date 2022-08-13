// eslint-disable-next-line import/no-commonjs
module.exports = {
  root: true,
  extends: ['@modern-js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['../tsconfig.json'],
  },
};
