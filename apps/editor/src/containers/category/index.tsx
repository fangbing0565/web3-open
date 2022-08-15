import React from 'react';
import { Route, Switch } from 'react-router';
import CategoryTreePage from './Tree';

const CategoryRoute = () => (
  <Switch>
    <Route path="/partner/category" exact={true} component={CategoryTreePage} />
  </Switch>
);

export default CategoryRoute;
