import React from 'react';
import { Tabs } from '@i18n-ecom/ui';

export interface RegionTabsProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const TabPane = Tabs.TabPane;

export const RegionTabs = ({
  value,
  options = [],
  onChange,
}: RegionTabsProps) => {
  return (
    <div className="relative overflow-y-auto">
      <Tabs activeTab={value} onChange={onChange}>
        {options.map(({ value, label }) => (
          <TabPane key={value} title={label} />
        ))}
      </Tabs>
    </div>
  );
};
