import { useEffect } from 'react';
import { RecoilValue, useRecoilValueLoadable } from 'recoil';
import { Message } from '@i18n-ecom/ui';

export const DEFAULT_ERROR_MSG = 'Server Error';
export const handleError = (e?: Error) => {
  Message.error(e?.message || DEFAULT_ERROR_MSG);
};
export type useLoadableReturn<T> = {
  data: T | undefined;
  state: 'loading' | 'hasValue' | 'hasError';
  error: Error | undefined;
  loading: boolean;
};
type Config<T> = { toastError?: boolean };
export default function useLoadable<T>(
  recoilLoadable: RecoilValue<T>,
  config?: Config<T>,
): useLoadableReturn<T> {
  const { toastError = true } = config ?? {};
  const { state, contents } = useRecoilValueLoadable<T>(recoilLoadable);
  useEffect(() => {
    if (toastError && state === 'hasError') {
      handleError(contents as Error);
    }
  }, [contents, state]);

  return {
    data: state === 'hasValue' ? (contents as T) : undefined,
    state,
    loading: state === 'loading',
    error: state === 'hasError' ? (contents as Error) : undefined,
  };
}
