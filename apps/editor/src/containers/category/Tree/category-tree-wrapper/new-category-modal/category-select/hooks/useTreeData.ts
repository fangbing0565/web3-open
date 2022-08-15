import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { ListChildCategoriesResponse } from '@/api/product/serv/oec_product_operator_backend_api';
import { OPCategory } from '@/api/operation/data/category_rule';
import { OperatorBackendCategory } from '@/api/product/data/operator_backend.d';
import { select, RootState } from '@/store';
import { State as ChildrenCategoriesState } from '@/models/requests/category/requestChildrenCategories';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import { ListOPCategoriesResponse } from '@/api/operation/serv/oec_operation_category_rule_api';

const expandedKeysSelector = (state: RootState): string[] =>
  state.categoryTree.expandedKeys;
const childrenCategoriesSelector = (state: RootState) =>
  state.requestChildrenCategories;

const generateTreeData = (
  expandedKeys: string[],
  childrenCategories: ChildrenCategoriesState,
  allCategories: OPCategory[] | Record<string, OPCategory>,
) => {
  if (!allCategories) {
    return [];
  }
  let tmpCategories: OPCategory[] = [];
  if (!Array.isArray(allCategories)) {
    tmpCategories = Object.keys(allCategories || {}).map(
      index => allCategories[index],
    );
  } else {
    tmpCategories = allCategories;
  }

  return tmpCategories?.map(category => {
    const { category_id, is_leaf, category_name } = category;
    const categoryItem: TreeDataType = {
      key: category_id,
      title: category_name,
      children: [],
      isLeaf: is_leaf,
      loading: expandedKeys.includes(category_id),
      ...category,
    };
    // set(categoryItem, 'dataRef', category);
    if (
      expandedKeys.includes(category_id) &&
      childrenCategories[category_id] &&
      childrenCategories[category_id].data
    ) {
      const currentChildrenCategories =
        childrenCategories[category_id].data?.categories || [];
      const loading = childrenCategories[category_id].loading || true;
      categoryItem.loading = loading;
      categoryItem.children?.push(
        ...generateTreeData(
          expandedKeys,
          childrenCategories,
          currentChildrenCategories,
        ),
      );
    }
    return categoryItem;
  });
};

const treeDataSelector = createSelector(
  expandedKeysSelector,
  childrenCategoriesSelector,
  select.requestAllCategories.dataSelector,
  (
    expandedKeys,
    childrenCategories,
    allCaregories: ListOPCategoriesResponse,
  ) => {
    const categories = allCaregories?.data?.categories ?? [];
    return generateTreeData(expandedKeys, childrenCategories, categories);
  },
);

export const useTreeData = () => {
  const treeData = useSelector<RootState, TreeDataType[]>(treeDataSelector);
  return [treeData];
};
