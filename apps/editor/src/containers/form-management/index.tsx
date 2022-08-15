import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PLATFORM } from '../../constants/form-management';
import ManagementList from './management-list';

const PlatFormRoute = () => (
  <Switch>
    <Route
      path={PLATFORM.formManagement}
      exact={true}
      component={ManagementList}
    />
  </Switch>
);

export default PlatFormRoute;
