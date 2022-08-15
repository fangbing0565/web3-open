import React from 'react';
import CategoryDetailTab from './detail-category-tab';
import CategoryTreeWrapper from './category-tree-wrapper';
import styles from './index.scss';
import { ContextProvider } from './context';

const Category = () => {
  return (
    <ContextProvider>
      <div className={styles.categoryTreePage}>
        <CategoryTreeWrapper />
        <div className={styles.categoryContentWrapper}>
          <CategoryDetailTab />
        </div>
      </div>
    </ContextProvider>
  );
};
export default Category;
// 类似于 category 的代码
