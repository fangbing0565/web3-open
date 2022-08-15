import { Action } from '@rematch/core';
import {
  ListFeCategoryChildrenResponse,
  categoryRuleAPIClient,
} from '@/api/operation/serv/oec_operation_category_rule_api';

export interface StateItem {
  data: null | ListFeCategoryChildrenResponse['data'];
  loading: boolean;
  errorCode: number;
  errorMsg: string;
}

export type State = Record<string, StateItem>;

const initialStateItem = {
  data: null,
  loading: true,
  errorCode: 0,
  errorMsg: '',
};

const initialState: State = {};

export const requestChildrenFeCategories = {
  state: initialState,
  reducers: {
    init() {
      return { ...initialState };
    },
    removeStateItem(state: State, key: string) {
      delete state[key];
      return {
        ...state,
      };
    },
    loading(state: State, key: string) {
      const stateItem = state[key] || { ...initialStateItem };
      return {
        ...state,
        [key]: {
          ...stateItem,
          loading: true,
        },
      };
    },
    onSuccess(
      state: State,
      key: string,
      response: ListFeCategoryChildrenResponse,
    ) {
      const stateItem = state[key] || { ...initialStateItem };
      return {
        ...state,
        [key]: {
          ...stateItem,
          data: {
            ...response,
          },
          loading: false,
          errorCode: 0,
          errorMsg: '',
        },
      };
    },
    onFail(state: State, key: string, response?: Partial<StateItem>) {
      const stateItem = state[key] || { ...initialStateItem };
      return {
        ...state,
        [key]: {
          ...stateItem,
          ...response,
        },
      };
    },
  },
  effects: () => {
    const cache: Record<string, { loading: boolean; expire: number }> = {};
    return {
      async load(
        this: {
          [key: string]: (payload?: any, meta?: any) => Action;
        },
        {
          tree_id,
          version_id,
          category_id,
        }: {
          tree_id: string;
          version_id: string;
          category_id: string;
        },
      ) {
        if (
          cache[category_id] &&
          (cache[category_id].loading || cache[category_id].expire < Date.now())
        ) {
          return;
        }

        cache[category_id] = {
          loading: true,
          expire: 0,
        };
        try {
          let res;
          if (category_id === '0') {
            res = await categoryRuleAPIClient.ListFirstLevelCategory({
              tree_id,
              version_id,
            });
          } else {
            res = await categoryRuleAPIClient.ListFeCategoryChildren({
              tree_id,
              version_id,
              category_id,
            });
          }
          if (res.code !== 0) {
            this.onFail(category_id, {
              data: null,
              errorCode: res.code || 500,
              errorMsg: res.message || 'unknown',
            });
            cache[category_id].loading = false;
            cache[category_id].expire = 0;
          } else {
            this.onSuccess(category_id, res.data);
            cache[category_id].loading = false;
            cache[category_id].expire = Date.now() + 10000 * 60;
          }
        } catch (error) {
          this.onFail(category_id, {
            data: null,
            errorCode: error.status || 500,
            errorMsg: error.text || 'unknown',
          });
          cache[category_id].loading = false;
          cache[category_id].expire = 0;
        }
      },
    };
  },
};
