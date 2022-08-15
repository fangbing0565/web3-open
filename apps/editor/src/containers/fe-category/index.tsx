import React from 'react';
import { Route, Switch } from 'react-router';
import { Paths, PathNames } from '../../constants/fe-category';
import CategoryTreePage from './Tree';
import TreeVersion from './TreeVersion';
import Category from './Category';

const FeCategoryRoute = () => (
  <Switch>
    <Route
      path={Paths.FeCategoryTree}
      exact={true}
      component={CategoryTreePage}
      name={PathNames.FeCategoryTree}
    />
    <Route
      path={Paths.FeCategoryTreeVersion}
      exact={true}
      component={TreeVersion}
      name={PathNames.FeCategoryTreeVersion}
    />
    <Route
      path={Paths.FeCategory}
      exact={true}
      component={Category}
      name={PathNames.FeCategory}
    />
  </Switch>
);

export default FeCategoryRoute;
