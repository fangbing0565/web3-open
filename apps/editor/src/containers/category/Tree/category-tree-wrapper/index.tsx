import React from 'react';
import { CategoryFilter } from './category-filter-wrapper';
import { TreeContent } from './tree-content';
import { TreeHeader } from './tree-header';

import styles from './index.scss';

const CategoryTreeWrapper = () => {
  return (
    <div className={styles.categoryTreeWrapper}>
      <CategoryFilter />
      <div className={styles.treeFragment}>
        <TreeHeader />
        <TreeContent />
      </div>
    </div>
  );
};

export default CategoryTreeWrapper;
