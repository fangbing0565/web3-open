import React from 'react';
import { Tabs } from '@i18n-ecom/ui';
import { pageOnlineStatus } from '../../constants';

const TabPane = Tabs.TabPane;

export const PageTab = ({ onChange, value }: any) => {
  const handleChange = (key: string) => {
    onChange(key);
  };
  return (
    <Tabs onChange={handleChange} activeTab={value || '1'}>
      {pageOnlineStatus.map(({ text, value }) => (
        <TabPane destroyOnHide={true} title={text} key={value} />
      ))}
    </Tabs>
  );
};
