import React from 'react';
import { Switch, Route } from 'react-router';
import {
  PATH as CATEGORY_RULE_PATH,
  DistributePageType,
  InfoPageType,
  CAT_RULE_MANAGER,
} from '@/constants/category-rule';
import { useRolePermission } from '@i18n-ecom-op/hooks';
import { useKaniPermission } from '@i18n-ecom-op/api-hooks';
import AddRulePage from './rule-add';
import RuleDistributedPage from './rule-distributed';
import RuleInfoPage from './rule-info';
import RuleListPage from './rule-list';
import ScopeListPage from './scope-list';
import { AuthRoute } from './common';

const CategoryRuleRoute = () => {
  // const { validate } = useKaniPermission();
  // const permission = validate('page_category_rule_mgmt');
  const [permission] = useRolePermission('cat_rule_manager');
  return (
    <Switch>
      <Route path={CATEGORY_RULE_PATH.list.path} exact={true}>
        <RuleListPage permission={permission} applyLink={CAT_RULE_MANAGER} />
      </Route>
      <AuthRoute path={CATEGORY_RULE_PATH.add.path} exact={true}>
        <AddRulePage />
      </AuthRoute>
      <AuthRoute path={CATEGORY_RULE_PATH.addDistribute.path} exact={true}>
        <RuleDistributedPage type={DistributePageType.add} />
      </AuthRoute>
      <AuthRoute path={CATEGORY_RULE_PATH.distribute.path} exact={true}>
        <RuleDistributedPage type={DistributePageType.edit} />
      </AuthRoute>
      <AuthRoute path={CATEGORY_RULE_PATH.edit.path} exact={false}>
        <RuleInfoPage
          type={InfoPageType.edit}
          permission={permission}
          applyLink={CAT_RULE_MANAGER}
        />
      </AuthRoute>
      <Route path={CATEGORY_RULE_PATH.view.path} exact={true}>
        <RuleInfoPage
          type={InfoPageType.view}
          permission={permission}
          applyLink={CAT_RULE_MANAGER}
        />
      </Route>
      <AuthRoute path={CATEGORY_RULE_PATH.viewDistribute.path}>
        <RuleDistributedPage type={DistributePageType.edit} />
      </AuthRoute>
      <Route
        path={CATEGORY_RULE_PATH.viewRuleValue.path}
        component={ScopeListPage}
        exact={true}
      />
    </Switch>
  );
};

export default CategoryRuleRoute;
