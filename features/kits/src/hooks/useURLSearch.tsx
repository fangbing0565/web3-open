import { useMemo } from 'react';
import { parse, stringify, StringifyOptions, ParseOptions } from 'query-string';
import { useHistory, useLocation } from '@jupiter/plugin-runtime/router';

export type UseURLSearchOptions = Pick<
  StringifyOptions,
  keyof StringifyOptions & keyof ParseOptions
>;

const useURLSearch = (
  options?: UseURLSearchOptions,
): [
  Record<string, any>,
  (values: Record<string, any>, type?: 'push' | 'replace') => void,
] => {
  const history = useHistory();
  const location = useLocation();
  const { search: searchString } = location;
  const search = useMemo(() => parse(searchString, options), [searchString]);
  const onSearch = (
    values: Record<string, any>,
    type: 'push' | 'replace' = 'push',
  ) => {
    const searchPath = stringify({ ...values }, options);
    if (searchString === searchPath) {
      return;
    }
    history[type](`?${searchPath}`);
  };

  return [search, onSearch];
};

export default useURLSearch;
