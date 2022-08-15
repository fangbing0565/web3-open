import React from 'react';
import { Select } from '@i18n-ecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { RootDispatch, select, RootState } from '@/store';
import { TriggerProps } from '@arco-design/web-react/es/Trigger';
import { ListCategoryStatusResponse } from '@/api/product/serv/oec_product_operator_backend_api';
import { Text } from '@i18n-ecom-op/components';
import styles from './index.scss';

const Option = Select.Option;

const triggerProps: TriggerProps = {
  autoAlignPopupWidth: false,
  autoAlignPopupMinWidth: false,
  position: 'bl',
  popupStyle: {
    width: '150px',
  },
};

const ALL_STATUS = {
  code: 0,
  name: 'All Status',
};

const PENDING_STATUS = {
  code: 6,
  name: 'Pending Approval',
};

const SELECT_TEXT = 'Filters';
const renderFormat = () => SELECT_TEXT;

export const FilterStatusSelect: React.FC = () => {
  const {
    requestAllCategoryStatus,
    requestAllCategories,
    categoryTree: { updateStatus, setExpandedKeys, updateSelectedKey },
  } = useDispatch<RootDispatch>();
  const data = useSelector<RootState, ListCategoryStatusResponse>(
    select.requestAllCategoryStatus.dataSelector,
  );
  const loading = useSelector<RootState, boolean>(
    select.requestAllCategoryStatus.loadingSelector,
  );
  const status = useSelector<RootState, string | number>(
    state => state.categoryTree.status,
  );
  const options = [ALL_STATUS];

  if (Array.isArray(data?.data)) {
    options.push(...data.data);
    options.push(PENDING_STATUS);
  }

  React.useEffect(() => {
    requestAllCategoryStatus.load();
  }, []);

  const handleChange = (value: any) => {
    updateStatus(value);
    requestAllCategories.init();
    setExpandedKeys([]);
    updateSelectedKey('');
  };
  return (
    <Select
      className={styles.searchSelect}
      allowClear={false}
      value={status}
      renderFormat={renderFormat}
      loading={loading}
      onChange={handleChange}
      getPopupContainer={node => node}
      triggerProps={triggerProps}>
      {options.map(status => {
        return (
          <Option key={status.code} value={status.code}>
            <Text content={status.name} />
          </Option>
        );
      })}
    </Select>
  );
};
