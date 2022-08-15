import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootDispatch, RootState, select } from '@/store';
import {
  SubmitSingleFormRequest,
  categoryRuleAPIClient,
} from '@/api/operation/serv/oec_operation_category_rule_api';
import { Divider, Button, Spin, Tabs } from '@i18n-ecom/ui';
import cx from 'classnames';
import { Message } from '@arco-design/web-react';
import { useURLSearch } from '@i18n-ecom-op/hooks';
import {
  AuditStatus,
  CategoryStatus,
} from '@/api/operation/data/category_rule';
import styles from './index.scss';
import CategoryBriefInfo from './components/category-brief-info';
import RuleSetting from './components/rule-setting';
import VariationSetting from './components/variation-setting';
import AttributeSetting from './components/attribute-setting';

const TabPane = Tabs.TabPane;

const CategoryDetailTab = () => {
  const [{ category_id }, setUrlSearch] = useURLSearch();
  const { getCategoryDetail } = useDispatch<RootDispatch>();
  const [categoryDetailInfo, setCategoryDetailInfo] = useState<any>();
  const loading: boolean = useSelector(
    select.getCategoryDetail.loadingSelector,
  );
  const {
    categoryTree: { setExpandedKeys, updateSelectedKey, setCheckedKeys },
  } = useDispatch<RootDispatch>();

  const categoryDetailResponse = useSelector(
    select.getCategoryDetail.dataSelector,
  );

  useEffect(() => {
    const categoryDetailInfo = categoryDetailResponse?.data?.base_info;
    setCategoryDetailInfo(categoryDetailInfo);
  }, [categoryDetailResponse]);

  const { selectedKey } = useSelector((state: RootState) => state.categoryTree);

  useEffect(() => {
    setUrlSearch({ category_id: selectedKey });
  }, [selectedKey]);
  const mutate = async () => {
    const res = await categoryRuleAPIClient.GetCategoryDetail({
      category_id,
    });
    const categoryDetailInfo = res?.data?.base_info;
    setCategoryDetailInfo(categoryDetailInfo);
  };
  useEffect(() => {
    if (category_id) {
      updateSelectedKey(category_id);
    }
  }, []);

  useEffect(() => {
    if (selectedKey) {
      getCategoryDetail.load({ category_id: selectedKey });
    } else {
      getCategoryDetail.init();
    }
    return () => {
      getCategoryDetail.init();
    };
  }, [selectedKey]);
  const handleSubmit = async () => {
    const request: SubmitSingleFormRequest = {
      form: {
        category_id: selectedKey,
      },
    };

    try {
      const { code, message } = await categoryRuleAPIClient.SubmitSingleForm(
        request,
      );
      if (code === 0) {
        Message.success(
          'Submit successfully，category will go online after approval.',
        );
      } else {
        Message.error(message);
      }
    } catch (error) {
      const { message } = error;
      Message.error(message);
    }
  };

  if (loading) {
    return (
      <div className={`${styles.spinContainer} ${styles.loadingEmptyWrapper}`}>
        <Spin />
      </div>
    );
  }
  if (!categoryDetailInfo) {
    return null;
  }

  if (!categoryDetailInfo?.is_leaf) {
    return (
      <>
        <div className={cx(styles['category-content-tabs'], 'pt-32', 'pb-12')}>
          <CategoryBriefInfo category={categoryDetailInfo} mutate={mutate} />
        </div>
      </>
    );
  }
  return (
    <>
      <div className={cx(styles['category-content-tabs'], 'pt-32', 'pb-24')}>
        <CategoryBriefInfo category={categoryDetailInfo} mutate={mutate} />
        <>
          <div className="ml-24 mr-24">
            <Divider />
          </div>
          <Tabs defaultActiveTab="ruleSetting" className="ml-24 mr-24">
            <TabPane key="ruleSetting" title="Rule Setting">
              <RuleSetting />
            </TabPane>
            <TabPane key="variationSetting" title="Variation Setting">
              <VariationSetting />
            </TabPane>
            <TabPane key="attributeSetting" title="Attribute Setting">
              <AttributeSetting categoryId={category_id} />
            </TabPane>
          </Tabs>
          {categoryDetailInfo.audit_status !== AuditStatus.Audit_QC_PENDING &&
          categoryDetailInfo.category_status ===
            CategoryStatus.CATEGORY_OFFLINE ? (
            <div className="mt-24 mr-24 flex justify-end">
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          ) : null}
        </>
      </div>
    </>
  );
};

export default CategoryDetailTab;
