module.exports = {
    type: 'react',
    entry: 'apps/', // 源代码路径，支持数组的方式传入多个
    output: 'output/', // 扫描报告输出路径
    exclude: [
      // 需要跳过的代码路径，支持 glob
      '**/locale/**/*.*',
      '**/*.d.ts',
      '**/assets/**',
    ],
    i18n: {
      /**
       * 扫描 i18n 的函数/组件代码时使用的正则表达式
       */
      scanRules: [
        /\s*\$t\(.+\)\s*/i,
        // 兼容 __()
        /\s*__\(.+\)\s*/i,
        // 兼容 gettext()
        /\s*gettext\(.+\)\s*/i,
      ],
      /**
       * 国际化代码替换时，实现 i18n 的函数/组件，工具可以注入三个参数
       *
       * @param {string} $key - 文案的 key
       * @param {string} $variable - 文案要插入的变量（已序列化）
       * @param {string} $defaultMessage - 原始文案
       */
      statement: "I18n.t('$key', $variable, $defaultMessage)",
      /**
       * 国际化代码替换时，如果需要自动引入 i18n 的依赖库，则需要配置该参数（vue 不支持）
       */
      import: '',
    },
    // starling 项目的信息：代码替换时，会直接从 starling 的文案仓库中通过文案查询 key
    // 其中 namespace 可以是多个 namespace 组成的数组，如： ['global', 'namespace1']
    starling: {
      projectName: 'i18n_ttspc',
      namespace: ['web'],
      api_key: '36422bf0f62211ec90c433e010d2c598',
      // 使用 collect 命令收集文案时候指定收集路径（代理自 starling-cli）
      collectPath: './',
      // extension: [".js"], //选填，默认扫描['.html', '.vue', '.js', '.ts', '.jsx','.tsx']
      // rules: [{
      //   rule: "\\$t"
      // }], // 选填 如需扫描规则 (推荐直接使用新版 scan命令扫描)
      // 使用 download 命令下载到本地的目录地址（代理自 starling-cli）
      distPath: '../locales/langs',
      // 使用 download -f 命令下载兜底文件时，指定兜底的语言
      fallbackLocales: [],
      // 使用 upload 命令上传文件到 starling 时的文件名 （代理自 starling-cli）
      uploadFile: '',
      // 翻译文件or段落（注意命令行的输入的优先级高于此)
      translate: {
        depth: '*', // 搜索文件夹层级
        exclude: ['./node_modules/**'], // 必须是string[] glob模式
        // "distPath": "./dist", // 输出文件夹
        fileName: "(before, tl) => (before + '-' + tl)", // 自定义文件名输出
      },
    },
  };
  