import { createSelector } from 'reselect';
import { CategoryState } from '@/models/category/tree';
import { RootState } from '@/store';

const state = (state: RootState): CategoryState => state.categoryTree;

export const selectedKeySelector = createSelector([state], state => {
  return state.selectedKey ? '0' : null;
});

export const expandedKeysSelector = createSelector([state], state => {
  return state.expandedKeys || [];
});
