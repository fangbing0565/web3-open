import React from 'react';
import { FilterStatusSelect, SearchSelect } from './components';
import styles from './index.scss';

export const CategoryFilter = () => {
  return (
    <div className={styles['search-bar']}>
      <FilterStatusSelect />
      <SearchSelect />
    </div>
  );
};
