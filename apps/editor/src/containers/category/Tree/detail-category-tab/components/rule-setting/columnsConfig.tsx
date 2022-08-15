import React from 'react';
import { OPColummProps } from '@i18n-ecom-op/components/op-table/interface';
import {
  CategoryRuleListItem,
  RuleType,
} from '@/api/operation/data/category_rule';
import RuleListAction from '../rule-list-action';

export const CATEGORY_RULE_TYPES_MAP: Record<number | string, string> = {
  [RuleType.TYPE_GOVERNANCE]: 'Governance',
  [RuleType.TYPE_OPERATION]: 'Operation',
  [RuleType.TYPE_LOGISTICS]: 'Logistics',
  [RuleType.TYPE_FINANCE]: 'Finance',
  [RuleType.TYPE_OTHERS]: 'Others',
};

export const getConfigs = (categoryID: string, dimension: string) => {
  const configs: OPColummProps[] = [
    {
      title: 'Rule Information',
      dataIndex: 'rule_id',
      width: 200,
      render: (_: any, ruleItem: CategoryRuleListItem) => {
        return (
          <div className="flex flex-col">
            <span>{ruleItem.rule_name}</span>
            <span>
              {'ID: '}
              {ruleItem.rule_id}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Rule Value id',
      dataIndex: 'rule_value_id',
      width: 150,
    },
    {
      title: 'Rule value Description',
      dataIndex: 'rule_value_desc',
      width: 300,
    },
    {
      title: 'Rule Type',
      dataIndex: 'type',
      width: 150,
      render: (ruleType: RuleType) => {
        return CATEGORY_RULE_TYPES_MAP[ruleType];
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 150,
      render: (_: any, rule: CategoryRuleListItem) => {
        return (
          <RuleListAction
            ruleId={rule.rule_id}
            category_id={categoryID}
            dimension={dimension}
            ruleValueId={rule.rule_value_desc}
          />
        );
      },
    },
  ];
  return configs;
};
