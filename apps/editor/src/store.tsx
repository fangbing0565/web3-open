import { init, RematchRootState, RematchDispatch } from '@rematch/core';
import loading from '@rematch/loading';
import selectPlugin from '@rematch/select';
import * as models from './models';

export const store = init({
  models,
  plugins: [loading(), selectPlugin()],
});
export const { dispatch } = store;
export const { select } = store;
export type Dispatch = typeof store.dispatch;
export type RootModel = typeof models;

interface LoadingPlugin {
  loading: {
    models: RematchRootState<RootModel>;
    effects: Dispatch;
  };
}

export type RootState = RematchRootState<RootModel> & LoadingPlugin;
export type RootDispatch = RematchDispatch<RootModel>;
