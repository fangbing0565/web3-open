import { APPROVAL_FORM_PATH } from '@/constants/approval-form';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ApprovalFormDetail from './approval';
import ServiceAuditFormDetail from './service';

const ApprovalFormRoute = () => (
  <Switch>
    <Route
      path={APPROVAL_FORM_PATH.approvalFormDetailPath.path}
      exact={true}
      component={ApprovalFormDetail}
    />
    <Route
      path={APPROVAL_FORM_PATH.serviceAuditFormDetailPath.path}
      exact={true}
      component={ServiceAuditFormDetail}
    />
  </Switch>
);

export default ApprovalFormRoute;
