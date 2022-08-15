import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PAGE_PATH } from '../../constants/page-components';
import PageComponentsList from './page-components-list';
import PagePreview from './page-preview';
import PageEdit from './page-edit';

const PageComponentsRoute = () => (
  <Switch>
    <Route
      path={PAGE_PATH.pageComponentsList.path}
      exact={true}
      component={PageComponentsList}
    />
    <Route
      path={PAGE_PATH.pageComponentPreview.path}
      exact={true}
      component={PagePreview}
    />
    <Route
      path={PAGE_PATH.pageComponentEdit.path}
      exact={true}
      component={PageEdit}
    />
  </Switch>
);

export default PageComponentsRoute;
