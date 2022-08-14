import React from 'react';
import { useModuleApps } from '@jupiter/plugin-runtime';
import { garfish } from '@jupiter/plugin-garfish';
import { ConfigProviderProps } from '@arco-design/web-react';
import { useMainUserInfo, useMainConfig } from '@oec-open/ttspc-bridge';
import { ConfigProvider as ArcoConfigProvider } from '@arco-design/web-react';
import '@arco-design/theme-m4b/css/arco.css';
// TODO Remember to delete，Replace with m4b Theme @Wang xiaoye
// import '@i18n-ecom/ui/dist/commonjs/style/theme/index.scss';

import Layout from './layout';
import MenuProvider from './hooks/useMenu';
import { Slardar, Tea } from '@oec-open/ttspc-kits';

garfish.setExternal(
  '@m4b-design/config-provider',
  require('@m4b-design/config-provider'),
);
garfish.setExternal(
  '@arco-design/web-react',
  require('@arco-design/web-react'),
);

garfish.setExternal({
  'react-router': 'react-router',
  'react-router-dom': 'react-router-dom',
  'react-loadable': 'react-loadable',
  '@reduck/core': '@reduck/core',
  '@jupiter/plugin-runtime/model': '@jupiter/plugin-runtime/model',
});

const componentConfig: ConfigProviderProps['componentConfig'] = {
  // Input: { size: 'large' },
  // InputNumber: { size: 'large' },
  // // InputTag: { size: 'large' },
  // Select: { size: 'large' },
  // Pagination: { size: 'small' },
  // TriggerProps: { showArrow: false },
  // Cascader: { size: 'large' },
  // AutoComplete: { inputProps: { size: 'large' } },
  // TreeSelect: { size: 'large' },
  // DatePicker: { size: 'large' },
};

const App = () => {
  Slardar.startSlardar({
    bid: 'partner_center',
    env: 'test',
  });

  (Tea as any).initTea(
    {
      app_id: 13801111,
      channel: 'va',
    },
    true,
  );

  const { apps } = useModuleApps();
  /**
   * 设置用户信息
   */
  useMainUserInfo({
    user_name: '',
    avatar_url: '',
    user_id: '',
    email: '',
    mobile: '',
  });
  /**
   * 设置语言
   */
  useMainConfig({
    lang: 'en',
  });

  if (apps.length > 0 && !window.Garfish.running) {
    console.log('fix garfish bug, add run()');
    window.Garfish.run();
  }

  return apps.length ? (
    <>
      <ArcoConfigProvider componentConfig={componentConfig}>
        <MenuProvider>
          <Layout apps={apps} />
        </MenuProvider>
      </ArcoConfigProvider>
    </>
  ) : null;
};

App.config = {
  features: {
    masterApp: {
      manifest: {
        goofyConfig: {
          url: 'https://oec-partner-boe.byteintl.net', // The routing address of the main application
          maxRetry: 3, // Maximum number of retries for failure
        },
      },
    },
    router: true,
  },
};

export default App;
