export interface CategoryState {
    selectedKey: string;
    expandedKeys: string[];
    checkedKeys: string[];
    needUpdate: number;
    selectedKeyForSelect: string;
    expandedKeysForSelect: string[];
  }
  
  const initialState: CategoryState = {
    selectedKey: '',
    expandedKeys: [],
    checkedKeys: [],
    needUpdate: 0,
    selectedKeyForSelect: '',
    expandedKeysForSelect: [],
  };
  
  export const feCategoryTree = {
    state: { ...initialState },
    reducers: {
      updateSelectedKey(state: CategoryState, selectedKey: string) {
        return {
          ...state,
          selectedKey,
        };
      },
      setExpandedKeys(state: CategoryState, expandedKeys: string[]) {
        return {
          ...state,
          expandedKeys,
        };
      },
      setCheckedKeys(state: CategoryState, checkedKeys: string[]) {
        return {
          ...state,
          checkedKeys,
        };
      },
      setNeedUpdate(state: CategoryState, num: number) {
        return {
          ...state,
          needUpdate: num,
        };
      },
      updateSelectedKeyForSelect(
        state: CategoryState,
        selectedKeyForSelect: string,
      ) {
        return {
          ...state,
          selectedKeyForSelect,
        };
      },
      setExpandedKeysForSelect(
        state: CategoryState,
        expandedKeysForSelect: string[],
      ) {
        return {
          ...state,
          expandedKeysForSelect,
        };
      },
    },
  };
  