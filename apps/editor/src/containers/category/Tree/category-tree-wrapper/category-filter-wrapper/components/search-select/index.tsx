import React from 'react';
import { AutoComplete, Spin } from '@i18n-ecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { RootDispatch, RootState, select } from '@/store';
import { debounce } from 'lodash';
import {
  SearchCategoryResponse,
  ListChildCategoriesResponse,
} from '@/api/product/serv/oec_product_operator_backend_api';
import type { OperatorBackendCategory } from '@/api/product/data/operator_backend.d';
import { Text } from '@i18n-ecom-op/components';
import { createSelector } from 'reselect';
import { selectedKeySelector } from '@/selectors/category';
import styles from './index.scss';

const Option = AutoComplete.Option;

const PLACEHOLDER = 'Category name/ID';

const triggerProps = {
  autoAlignPopupWidth: false,
  autoAlignPopupMinWidth: false,
  popupStyle: {
    width: '200px',
  },
};

const firstCategorySelector = createSelector<
  RootState,
  ListChildCategoriesResponse,
  OperatorBackendCategory | null
>(select.requestAllCategories.dataSelector, state =>
  // get(state, ['data', 0], null),
  state && state.data ? state.data[0] : null,
);

type OptionType = {
  value: string;
  label: string;
};

const idRegExp = /^[\d]+$/;

export const SearchSelect = () => {
  const [searchText, setSearchText] = React.useState<string>('');
  const {
    requestSearchCategories,
    requestChildrenCategories,
    categoryTree: { setExpandedKeys, updateSelectedKey },
  } = useDispatch<RootDispatch>();
  const selectedKey = useSelector(selectedKeySelector);
  const firstCategory = useSelector(firstCategorySelector);
  const data = useSelector<RootState, SearchCategoryResponse>(
    select.requestSearchCategories.dataSelector,
  );
  const loading = useSelector<RootState, SearchCategoryResponse>(
    select.requestSearchCategories.loadingSelector,
  );
  const status = useSelector<RootState, string | number>(
    state => state.categoryTree.status,
  );
  const request = React.useMemo(
    () =>
      debounce((key_word: string) => {
        requestSearchCategories.load({ status, key_word });
      }, 500),
    [status],
  );

  React.useEffect(() => {
    if (selectedKey || !firstCategory) {
      return;
    }
    // if the selectedKey is empty, it will set the default selectedKey from all categories.
    updateSelectedKey(firstCategory.id);
  }, [selectedKey, firstCategory]);

  const handleSearch = (inputValue: string) => {
    setSearchText(inputValue);
    request(inputValue);
  };

  const handleSelect = (
    value: string,
    { extra }: { extra?: { option?: { value: string; label: string } } },
  ) => {
    if (extra?.option?.label) {
      setSearchText(extra.option.label);
    }
    const ids = value.split('_');
    if (ids.length === 0) {
      return;
    }
    setExpandedKeys(Array.from(new Set([...ids])));
    updateSelectedKey(ids[ids.length - 1]);
    // After select the item, will load the all children categories from the id
    ids.forEach(id => {
      requestChildrenCategories.load({ id });
    });
  };

  let options: React.ReactNode[] | undefined = [];
  if (idRegExp.test(searchText)) {
    options = data?.data
      ?.slice(0, 50)
      .reduce((result: React.ReactNode[], category) => {
        const option = {
          value: category.id,
          label: category.name,
        };
        let { children } = category;
        while (children && children[0]) {
          const child = children[0];
          option.value = `${option.value}_${child.id}`;
          option.label = `${option.label} / ${child.name}`;
          children = child.children;
        }
        result.push(
          <Option key={option.value} value={option.value} extra={{ option }}>
            <Text content={option.label} />
          </Option>,
        );
        return result;
      }, []);
  } else {
    options = data?.data
      ?.slice(0, 50)
      .map(category => {
        const option: OptionType[] = [];
        const text = searchText.trim().toLowerCase();
        if (category?.name.toLowerCase().includes(text)) {
          option.push({ value: category.id, label: category.name });
        }
        let { children } = category;
        const parent = { value: category.id, label: category.name };
        while (children && children[0]) {
          const child = children[0];
          if (child?.name.toLowerCase().includes(text)) {
            option.push({
              value: `${parent.value}_${child.id}`,
              label: `${parent.label} / ${child.name}`,
            });
          }
          children = child.children;
          parent.value = `${parent.value}_${child.id}`;
          parent.label = `${parent.label} / ${child.name}`;
        }
        return option;
      }, [])
      .flat()
      .map(item => {
        return (
          <Option key={item.value} value={item.value} extra={{ item }}>
            <Text content={item.label} />
          </Option>
        );
      });
  }

  return (
    <div className={styles.searchWrapper}>
      <AutoComplete
        filterOption={false}
        data={options}
        allowClear={true}
        placeholder={PLACEHOLDER}
        onSearch={handleSearch}
        onSelect={handleSelect}
        triggerProps={triggerProps}
        value={searchText}
      />
      {loading && searchText ? (
        <div className={styles.spinWrapper}>
          <Spin />
        </div>
      ) : null}
    </div>
  );
};
