const {
    genTailwindConfig,
  } = require('@byted-zephyr/design-token/tailwind.config');
  const { colors } = require('@byted-zephyr/design-token');
  const lineClamp = require('@tailwindcss/line-clamp');
  
  // 这个文件按照国际化后台规范设置
  // https://www.figma.com/file/z47hSPxIHvSEa3Y8IGZbzw
  
  // 这个文件是给vscode的tailwind插件读取的
  // main模块下的jupiter.config.js会读取这个文件，供Jupiter使用
  module.exports = genTailwindConfig({
    theme: {
      // 设置font-size，第二个数据是行高，用法：text-lg
      // TODO: 这里目前还没有变量，后续需要适配再添加
      fontSize: {
        sm: ['12px', '18px'],
        base: ['14px', '20px'],
        lg: ['16px', '24px'],
        xl: ['18px', '28px'],
        '2xl': ['20px', '30px'],
        '3xl': ['24px', '30px'],
      },
      // 设置line-height，用法：leading-lg
      lineHeight: {
        sm: '18px',
        base: '21px',
        lg: '24px',
        xl: '27px',
        '2xl': '30px',
      },
      // 设置font-weight，用法：font-bold
      fontWeight: {
        regular: '400',
        semibold: '600',
        bold: '700',
      },
      // 设置颜色，用法：font-gray-disable / bg-brand / border-gray-border
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000',
        white: '#fff', // 灰度/白色
        // 使用 function-error 或 auxiliary-red-text|line|bg
        error: {
          default: 'var(--error-color)', // 警示色/错误
          bg: colors.auxiliaryRedBg,
        },
        // 使用 function-warning 或 auxiliary-yellow-text|line|bg
        warn: {
          default: 'var(--warning-color)', // 警示色/警示
          bg: colors.auxiliaryYellowBg,
        },
        // 使用 function-success 或 auxiliary-green-text|line|bg
        success: {
          default: 'var(--success-color)', // 警示色/成功
          bg: colors.auxiliaryGreenBg,
        },
        // 尽量不要用，使用 auxiliary 系列代替
        secondary: {
          default: 'var(--secondary-color)', // 辅助色/04
          bg: '#E1F0FF',
        },
        // 这三个一般用于文字颜色
        gray: {
          // 使用 neutral-text1
          1: colors.neutralText1, // 灰度/一级文字
          // 使用 neutral-text2
          2: colors.neutralText2, // 灰度/二级文字、次级文字按钮
          // 使用 neutral-text3
          3: colors.neutralText3, // 灰度/三级文字、icon
          // 使用 neutral-text5
          disabled: colors.neutralText5, // 灰度/暗文、文字按钮不可用
          // 使用 neutral-line1
          border: colors.neutralLine1, // 灰度/边框、图标不可用
          // 使用 neutral-line2
          line: colors.neutralLine2, // 灰度/分割线、输入框不可用背景
          // 使用 neutral-line2
          page: colors.neutralBg2, // 灰度/页面背景色
        },
        // 品牌色
        brand: {
          // 使用 brand-normal
          default: colors.brandNormal,
          // 使用 brand-selectedbg
          'table-hover': colors.brandSelectedbg, // 商家后台品牌色/hover
          bg3: '#5245e50d',
          dark: 'var(--dark-brand-color)',
          dark2: 'var(--transparent-dark-brand-color)',
          'gradient-hover': 'var(--merchant-brand-gradient-hover)',
          'gradient-active': 'var(--merchant-brand-gradient-active)',
        },
        neutral: {
          navbarBg: '#03033f',
        },
      },
      // 用于设置距离。用法：px-2 / my-3
      // TODO: 这里目前还没有变量，后续需要适配再添加
      spacing: {
        0: '0',
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
        6: '6px',
        8: '8px',
        12: '12px',
        14: '14px',
        16: '16px',
        18: '18px',
        20: '20px',
        24: '24px',
        28: '28px',
        32: '32px',
        36: '36px',
        40: '40px',
        48: '48px',
        60: '60px',
        64: '64px',
        72: '72px',
        74: '74px',
      },
      // borderRadius，用法：rounded, rounded-md
      borderRadius: {
        default: 'var(--default-box-border-radius)',
        lg: 'var(--default-box-border-radius-big)',
      },
      borderWidth: {
        0: '0',
        default: '1px',
      },
      screens: {
        xl: '1280px',
      },
    },
    plugins: [lineClamp],
  });
  