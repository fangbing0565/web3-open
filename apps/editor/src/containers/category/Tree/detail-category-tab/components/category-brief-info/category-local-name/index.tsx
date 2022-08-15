import React from 'react';
import { Text } from '@i18n-ecom-op/components';

interface CategoryLocalNameProps {
  region: string;
  localName: string;
}

const CategoryLocalName = (props: CategoryLocalNameProps) => {
  const { region, localName } = props;
  return (
    <div key={region} className="flex flex-row">
      <span className="w-32">{`${region}: `}</span>
      <div className="overflow-hidden flex-1">
        <Text content={localName} />
      </div>
    </div>
  );
};

export default CategoryLocalName;
