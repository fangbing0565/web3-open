import React, { useState, useEffect, FC } from 'react';
import { Result, Tabs } from '@i18n-ecom/ui';
import { OPTable } from '@i18n-ecom-op/components';
import { RuleDimensionInfo } from '@/api/operation/data/category_rule';
import {
  CATEGORY_RULE_DIMENSION_SALE_TYPES,
  RESPONSE_CODE,
} from '@/containers/rule-management/constants';
import { categoryRuleAPIClient } from '@/api/operation/serv/oec_operation_category_rule_api';
import { Message } from '@arco-design/web-react';
import { useRequest } from '@byted/hooks';
import handleError from '@i18n-ecom-op/libs/handleError';
import { getConfigs } from './table-config';

const TabPane = Tabs.TabPane;
const INIT_PAGESIZE = 10;
const INIT_CURRENT = 1;

type AttributeSettingProps = {
  categoryId: string;
};

const AttributeSetting: FC<AttributeSettingProps> = ({ categoryId }) => {
  const [allDimensions, setAllDimensions] = useState<RuleDimensionInfo[]>([]);
  const [activeTab, setActiveTab] = useState<string>();
  const [pageSize, setPageSize] = useState(INIT_PAGESIZE);
  const [current, setCurrent] = useState(INIT_CURRENT);

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

  const { loading, data, refresh } = useRequest(
    async () => {
      try {
        if (!activeTab) {
          return {};
        }
        const regionAndSaleType = activeTab?.split('-');
        const { data } = await categoryRuleAPIClient.CategoryPropertyList({
          category_id: categoryId,
          region: regionAndSaleType?.[0],
          sale_type: Number(regionAndSaleType?.[1]),
          get_product_property: true,
        });
        return data ?? {};
      } catch (e) {
        handleError(e);
      }
      return {};
    },
    { auto: true, refreshDeps: [activeTab] },
  );

  const properties = data?.properties?.slice(
    (current - 1) * pageSize,
    current * pageSize,
  );

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
            columns={getConfigs()}
            data={properties}
            rowKey="property_id"
            loading={loading}
            pagination={{
              pageSize,
              total: data?.properties?.length,
              onChange: (pageNumber: number, pageSize: number) => {
                setCurrent(pageNumber);
                setPageSize(pageSize);
              },
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

export default AttributeSetting;
