import React from 'react';
import { Provider } from 'react-redux';
import { RecoilRoot } from 'recoil';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'tailwindcss/tailwind.css';

// import BrandRoute from './containers/brand-management';
import { store } from './store';
import Routes from './routes';
import '@i18n-ecom-op/libs/inject-env';
import { PATH as CATEGORY_RULE_PATH } from './constants/category-rule';
import { BIZ_PATH } from './constants/biz-components';
import { PAGE_PATH } from './constants/page-components';
import {
  Paths as FeCategoryPaths,
  PathNames as FeCategoryPathNames,
} from './constants/fe-category';
import {
  Paths as CategoryManagementPaths,
  PathNames as CategoryManagementPathNames,
} from './constants/category';

dayjs.extend(utc);

const App: Application = () => {
  return (
    <>
      <Provider store={store}>
        <RecoilRoot>
          <Routes />
        </RecoilRoot>
      </Provider>
    </>
  );
};

App.appConfig = {
  layoutConfig: {
    showRegionSelect: true,
    showTimezoneSelect: true,
  },
  pageConfig: [
    {
      name: BIZ_PATH.bizComponentsList.path,
      path: BIZ_PATH.bizComponentsList.name,
    },
    {
      name: PAGE_PATH.pageComponentsList.path,
      path: PAGE_PATH.pageComponentsList.name,
    },
    {
      name: CategoryManagementPaths.CategoryManagement,
      path: CategoryManagementPathNames.CategoryManagement,
    },
    {
      name: FeCategoryPathNames.FeCategoryTree,
      path: FeCategoryPaths.FeCategoryTree,
      children: [
        {
          name: FeCategoryPathNames.FeCategoryTreeVersion,
          path: FeCategoryPaths.FeCategoryTreeVersion,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          redirect: ({ _ }, path) => {
            return path.split('/').slice(0, 5).join('/');
          },
          children: [
            {
              name: FeCategoryPathNames.FeCategory,
              path: FeCategoryPaths.FeCategory,
            },
          ],
        },
      ],
    },
    {
      name: CATEGORY_RULE_PATH.list.name,
      path: CATEGORY_RULE_PATH.list.path,
      children: [
        {
          name: CATEGORY_RULE_PATH.add.name,
          path: CATEGORY_RULE_PATH.add.path,
        },
        {
          name: CATEGORY_RULE_PATH.addDistribute.name,
          path: CATEGORY_RULE_PATH.addDistribute.path,
        },
        {
          name: CATEGORY_RULE_PATH.distribute.name,
          path: CATEGORY_RULE_PATH.distribute.path,
        },
        {
          name: CATEGORY_RULE_PATH.view.name,
          path: CATEGORY_RULE_PATH.view.path,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          redirect: ({ _ }, path) => {
            return path.split('/').slice(0, 5).join('/');
          },
          children: [
            {
              name: CATEGORY_RULE_PATH.viewDistribute.name,
              path: CATEGORY_RULE_PATH.viewDistribute.path,
            },
            {
              name: CATEGORY_RULE_PATH.viewRuleValue.name,
              path: CATEGORY_RULE_PATH.viewRuleValue.path,
            },
          ],
        },
        {
          name: CATEGORY_RULE_PATH.edit.name,
          path: CATEGORY_RULE_PATH.edit.path,
        },
      ],
    },
  ],
};

export default App;
