# Your Package

## Get Started

按开发环境的要求，运行和调试项目

运行和调试组件

```
pnpm run dev
```

运行测试用例

```
pnpm run test
```

按照社区规范和最佳实践，生成构建产物

```
pnpm run build
```

继续创建更多项目要素

```
pnpm run new
```

## ferry.base.js

```
const baseConfig = require('@i18n-ecom-ttspc/config/ferry.base');

const resConfig = Object.assign(
  baseConfig,
  {
    idlFetchs: [
      {
        ...baseConfig.idlFetchs[0],
        // Edit glob string here to filter IDL domain involved
        entry: './**/@(operation)/**/**.proto',
      },
      ...
    ]
  },
);

module.exports = resConfig;

```
## eslint.base.js
```
module.exports = {
  extends: ['@i18n-ecom-ttspc/config/eslint.base.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
}

```

## tailwind.config.js
后续多主题设置统一在这里添加，

```
// only use for ide to give hint, will not use this file to compile
module.exports = require('@oec-ttspc/config/tailwind.config');

```
