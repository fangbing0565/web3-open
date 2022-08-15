import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { BIZ_PATH } from '../../constants/biz-components';
import BizComponentsList from './biz-components-list';
import BizPreview from './biz-preview';
import BizEdit from './biz-edit';

const BizComponentsRoute = () => (
  <Switch>
    <Route
      path={BIZ_PATH.bizComponentsList.path}
      exact={true}
      component={BizComponentsList}
    />
    <Route
      path={BIZ_PATH.bizComponentPreview.path}
      exact={true}
      component={BizPreview}
    />
    <Route
      path={BIZ_PATH.bizComponentEdit.path}
      exact={true}
      component={BizEdit}
    />
  </Switch>
);

export default BizComponentsRoute;
