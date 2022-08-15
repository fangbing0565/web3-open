export interface CategoryState {
    selectedKey: string;
    expandedKeys: string[];
    checkedKeys: string[];
    status: string | number;
    needUpdate: number;
    selectedKeyForSelect: string;
    expandedKeysForSelect: string[];
  }
  
  const initialState: CategoryState = {
    status: 0,
    selectedKey: '0',
    expandedKeys: [],
    checkedKeys: [],
    needUpdate: 0,
    selectedKeyForSelect: '',
    expandedKeysForSelect: [],
  };
  
  export const categoryTree = {
    state: { ...initialState },
    reducers: {
      updateStatus(state: CategoryState, status: number | string) {
        return {
          ...state,
          status,
        };
      },
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
  