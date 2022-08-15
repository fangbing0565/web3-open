import React from 'react';
import {
  ApprovalFormRoute,
  BizComponentsRoute,
  CategoryRoute,
  CategoryRuleRoute,
  FeCategoryRoute,
  PageComponentsRoute,
  PlatFormRoute,
} from './containers';

const Routes = () => {
  return (
    <>
      <BizComponentsRoute />
      <CategoryRoute />
      <CategoryRuleRoute />
      <FeCategoryRoute />
      <PageComponentsRoute />
      <PlatFormRoute />
      <ApprovalFormRoute />
    </>
  );
};

export default Routes;
