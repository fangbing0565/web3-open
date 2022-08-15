import {
    RuleType,
    RuleMode,
    DistributionStatus,
  } from '@/api/operation/data/category_rule';
  import { PathScope } from './constant';
  
  export const PATH = {
    list: {
      path: PathScope.categoryRule,
      name: 'Category Rule Management',
    },
    add: {
      path: `${PathScope.categoryRule}/add`,
      name: 'Add New Category Rule',
    },
    addDistribute: {
      path: `${PathScope.categoryRule}/add/distribute/:id`,
      name: 'Add New Category Rule',
    },
    edit: {
      path: `${PathScope.categoryRule}/edit/:id`,
      name: 'Edit Category Rule',
    },
    view: {
      path: `${PathScope.categoryRule}/view/:id`,
      name: 'Category Rule Information',
    },
    distribute: {
      path: `${PathScope.categoryRule}/distribute/:id`,
      name: 'Distribute',
    },
    viewDistribute: {
      path: `${PathScope.categoryRule}/view/:id/distribute`,
      name: 'Distribute',
    },
    viewRuleValue: {
      path: `${PathScope.categoryRule}/view/:id/look/:ruleValueId`,
      name: 'Rule Value Scope',
    },
  };
  
  export enum InfoPageType {
    view = 'view',
    edit = 'edit',
  }
  
  export enum DistributePageType {
    add = 'add',
    edit = 'edit',
  }
  export enum CreateTableType {
    add = 'add',
    edit = 'edit',
  }
  export const CATEGORY_RULE_MODE = {
    [RuleMode.MODE_CROSS_BORDER]: 'Cross Border',
    [RuleMode.MODE_LOCAL]: 'Local To Local',
    [RuleMode.MODE_UNIVERSAL]: 'Universal',
    [RuleMode.MODE_UNDEFINED]: '',
  };
  
  export const CATEGORY_DISTRIBUTION = {
    [DistributionStatus.TO_BE_DISTRIBUTED]: 'To Be Distributed',
    [DistributionStatus.DISTRIBUTED]: 'Distributed',
    [DistributionStatus.UNSPECIFIED]: '',
  };
  
  export const CATEGORY_RULE_TYPE_OPTIONS = [
    {
      value: `${RuleType.TYPE_UNDEFINED}`,
      label: 'All',
    },
    {
      value: `${RuleType.TYPE_GOVERNANCE}`,
      label: 'Governance',
    },
    {
      value: `${RuleType.TYPE_OPERATION}`,
      label: 'Operation',
    },
    {
      value: `${RuleType.TYPE_LOGISTICS}`,
      label: 'Logistics',
    },
    {
      value: `${RuleType.TYPE_FINANCE}`,
      label: 'Finance',
    },
    {
      value: `${RuleType.TYPE_OTHERS}`,
      label: 'Others',
    },
  ];
  
  export const CATEGORY_RULE_TYPE_MAPPING = CATEGORY_RULE_TYPE_OPTIONS.reduce(
    (result, { value, label }) => {
      result[value] = label;
      return result;
    },
    {} as Record<string, string>,
  );
  export const CAT_RULE_MANAGER = IS_FANS
    ? 'https://i-ee.byted.org/kani/v2/#/apply/workflow/?appId=1392&roleKey=cat_rule_manager'
    : 'https://sg-ee.byted.org/kani/v2/#/apply/workflow/?appId=1031&roleKey=cat_rule_manager';
  