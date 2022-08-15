import React from 'react';
import CategoryDetailTab from './detail-category-tab';
import CategoryTreeWrapper from './category-tree-wrapper';
import styles from './index.scss';

const CategoryTreePage = () => {
  return (
    <div className={styles.categoryTreePage}>
      <CategoryTreeWrapper />
      <div className={styles.categoryContentWrapper}>
        <CategoryDetailTab />
      </div>
    </div>
  );
};

export default CategoryTreePage;
