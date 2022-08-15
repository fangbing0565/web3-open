import { Action } from '@rematch/core';
import {
  ListOPCategoriesResponse,
  categoryRuleAPIClient,
} from '@/api/operation/serv/oec_operation_category_rule_api';

export interface StateItem {
  data: null | ListOPCategoriesResponse['data'];
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

export const requestChildrenCategories = {
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
    onSuccess(state: State, key: string, response: ListOPCategoriesResponse) {
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
          id,
          category_status,
          audit_status,
        }: { id: string; category_status?: number; audit_status?: number },
      ) {
        if (cache[id] && (cache[id].loading || cache[id].expire < Date.now())) {
          return;
        }

        cache[id] = {
          loading: true,
          expire: 0,
        };

        try {
          const requestParams: Record<string, any> = {
            category_id: id,
            category_status,
            audit_status,
          };
          const res = await categoryRuleAPIClient.ListOPChildrenCategories(
            requestParams,
          );
          if (res.code !== 0) {
            this.onFail(id, {
              data: null,
              errorCode: res.code || 500,
              errorMsg: res.message || 'unknown',
            });
            cache[id].loading = false;
            cache[id].expire = 0;
          } else {
            this.onSuccess(id, res.data);
            cache[id].loading = false;
            cache[id].expire = Date.now() + 10000 * 60;
          }
        } catch (error) {
          this.onFail(id, {
            data: null,
            errorCode: error.status || 500,
            errorMsg: error.text || 'unknown',
          });
          cache[id].loading = false;
          cache[id].expire = 0;
        }
      },
    };
  },
};
