import React, { useState, useEffect } from 'react';
import { Result, Tabs } from '@i18n-ecom/ui';
import { OPTable } from '@i18n-ecom-op/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootDispatch, select, RootState } from '@/store';
import {
  RuleDimensionInfo,
  RuleDimensionInfoSaleType,
} from '@/api/operation/data/category_rule';
import {
  CATEGORY_RULE_DIMENSION_SALE_TYPES,
  RESPONSE_CODE,
} from '@/containers/rule-management/constants';
import { categoryRuleAPIClient } from '@/api/operation/serv/oec_operation_category_rule_api';
import { Message } from '@arco-design/web-react';
import { getConfigs } from './columnsConfig';

const TabPane = Tabs.TabPane;

const RuleSetting = () => {
  const [allDimensions, setAllDimensions] = useState<RuleDimensionInfo[]>([]);
  const [activeTab, setActiveTab] = useState<string>();
  const loading: boolean = useSelector(select.getCategoryRules.loadingSelector);

  const [size, setSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const { selectedKey, needUpdate } = useSelector(
    (state: RootState) => state.categoryTree,
  );

  const { getCategoryRules } = useDispatch<RootDispatch>();

  const getCategoryRulesResponse = useSelector(
    select.getCategoryRules.dataSelector,
  );
  const ruleList = getCategoryRulesResponse?.data?.rule_items;

  useEffect(() => {
    if (activeTab) {
      getCategoryRules.init();
      getCategoryRules.load({
        category_id: selectedKey,
        region: activeTab,
      });
    }
  }, [selectedKey, activeTab, needUpdate]);

  useEffect(() => {
    fetchDimensions();
  }, []);

  const fetchDimensions = async () => {
    try {
      const res = await categoryRuleAPIClient.DimensionsList({});
      const { code, data } = res;
      const { all_dimensions } = data ?? {};
      if (code === RESPONSE_CODE.SUCCESS && all_dimensions?.length) {
        setAllDimensions(all_dimensions);
        setActiveTab(
          `${all_dimensions[0].region}-${all_dimensions[0].sale_type}`,
        );
      }
    } catch (e) {
      Message.error(e.message);
    }
  };

  const handlePaginationChange = (current: number, pageSize: number) => {
    const newCurrent = current ? current : 1;
    const newPageSize = pageSize ? pageSize : 10;
    setCurrent(newCurrent);
    setSize(newPageSize);
  };

  return (
    <div>
      {activeTab ? (
        <>
          <Tabs
            className="mb-24 mt-8"
            activeTab={activeTab}
            onChange={(key: string) => {
              setActiveTab(key);
            }}>
            {allDimensions.map(item => {
              const saleType =
                CATEGORY_RULE_DIMENSION_SALE_TYPES[item.sale_type as number];
              return (
                <TabPane
                  key={`${item.region}-${item.sale_type}`}
                  title={`${item.region} - ${saleType}`}
                />
              );
            })}
          </Tabs>
          <OPTable
            columns={getConfigs(selectedKey || '', activeTab)}
            data={ruleList?.slice((current - 1) * size, current * size)}
            loading={loading}
            pagination={{
              total: ruleList?.length,
              pageSize: size,
              current,
              onChange: handlePaginationChange,
            }}
            scroll={{ x: true }}
          />
        </>
      ) : (
        <Result subTitle="No local rules." />
      )}
    </div>
  );
};

export default RuleSetting;
