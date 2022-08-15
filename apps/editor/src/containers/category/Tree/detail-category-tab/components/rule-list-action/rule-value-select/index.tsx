import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { select, RootDispatch } from '@/store';
import { Modal, Message, Select } from '@i18n-ecom/ui';
import { RuleValueItem } from '@/api/operation/data/category_rule';
import { Text } from '@i18n-ecom-op/components';
import { RuleValueSpan, SelectContainer } from './styled';
import styles from './index.scss';

interface RuleValueSelectProps {
  ruleId: string;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const Option = Select.Option;
const RuleValueSelect = (props: RuleValueSelectProps) => {
  const { ruleId, selectedValue, onSelect } = props;
  const [value, setValue] = useState<string>();
  const { getRuleDetail } = useDispatch<RootDispatch>();

  const ruleDetailResponse = useSelector(select.getRuleDetail.dataSelector);
  const rule_values = ruleDetailResponse?.data?.rule_values;

  useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue]);
  const handleSelect = (value: string) => {
    setValue(value);
    onSelect(value);
  };

  useEffect(() => {
    getRuleDetail.init();
    getRuleDetail.load({ id: ruleId });
  }, [ruleId]);

  return (
    <div className="flex flex-row items-center w-full">
      <RuleValueSpan>Rule Value</RuleValueSpan>
      <SelectContainer className={styles.container}>
        <Select
          value={value}
          onChange={handleSelect}
          placeholder="Please choose rule value">
          {rule_values?.map((item: RuleValueItem) => {
            return (
              <Option key={item.id} value={item.id}>
                <Text content={item.description} />
              </Option>
            );
          })}
        </Select>
      </SelectContainer>
    </div>
  );
};

export default RuleValueSelect;
