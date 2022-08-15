import React from 'react';
import { OPColummProps } from '@i18n-ecom-op/components/op-table/interface';
import {
  CategoryProperty,
  CategoryPropertyValue,
  PropertyFeature,
} from '@/api/operation/data/category_rule';
import Action from './action';

export const getConfigs = () => {
  const configs: OPColummProps[] = [
    {
      title: 'No',
      dataIndex: 'No',
      width: 150,
      render: (col, item, index: number) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: 'Attribute Name/ID',
      dataIndex: 'property_id',
      width: 200,
      render: (col: string, properties: CategoryProperty) => {
        return (
          <span>
            {properties.property_name}/{col}
          </span>
        );
      },
    },
    {
      title: 'Attribute Value Name',
      dataIndex: 'values',
      width: 300,
      render: (col: CategoryPropertyValue[]) => {
        return col
          ?.filter((item, index) => index < 3)
          .map(item => {
            return item.property_value_name;
          })
          .join(';');
      },
    },
    {
      title: 'If Mandotory',
      dataIndex: 'property_feature.is_mandatory',
      width: 150,
      render: (col: boolean) => {
        return col ? <span>YES</span> : <span>NO</span>;
      },
    },
    {
      title: 'Input Type',
      dataIndex: 'property_feature',
      width: 150,
      render: (col: PropertyFeature) => {
        return (
          <>
            {col?.is_enum && col?.is_input && <span>可枚举可输入</span>}
            {!col?.is_enum && col?.is_input && <span>不可枚举可输入</span>}
            {col?.is_enum && !col?.is_input && <span>可枚举不可输入</span>}
          </>
        );
      },
    },
    {
      title: 'Action',
      render: (_: unknown, properties: CategoryProperty) => (
        <Action properties={properties} />
      ),
      fixed: 'right',
      width: 125,
    },
  ];
  return configs;
};
