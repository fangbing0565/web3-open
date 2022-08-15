import React, { useState } from 'react';
import { Button, Divider, Descriptions, Link, Popconfirm } from '@i18n-ecom/ui';
import { useSelector } from 'react-redux';
import { useRolePermission } from '@i18n-ecom-op/hooks';
import { createSelector } from 'reselect';
import { RootState } from '@/store';
import { CategoryState } from '@/models/category/tree';
import { Space, Message } from '@arco-design/web-react';
import {
  CategoryRegionPair,
  CategoryDetail,
  AuditStatus,
  CategoryStatus,
} from '@/api/operation/data/category_rule';
import {
  categoryRuleAPIClient,
  UpdateCategoryStatusRequest,
  CategoryStatus as CategoryStatus2,
} from '@/api/operation/serv/oec_operation_category_rule_api';
import { Text } from '@i18n-ecom-op/components';
import { useKaniPermission } from '@i18n-ecom-op/api-hooks';
import NewCategoryModal from '../../../category-tree-wrapper/new-category-modal';
import {
  CategoryBriefInfoContainer,
  IDContainer,
  PathContainer,
} from './styled';
import StatusTag from './status-tag';
import CategoryLocalName from './category-local-name';
import { CATEGORY_STATUS_MAP, CATEGORY_COLOR_MAP } from './constants';

const selectedKeySelector = createSelector<
  RootState,
  CategoryState,
  string | number
>(
  state => state.categoryTree,
  ({ selectedKey }) => selectedKey,
);

const BOE_AUDIT_URL = `${APPROVAL_DOMAIN}/portal/#/Tasks/TodoTask`;
const ONLINE_AUDIT_URL = `${APPROVAL_DOMAIN}/portal/#/Tasks/TodoTask`;
const AUDIT_URL = IS_BOE ? BOE_AUDIT_URL : ONLINE_AUDIT_URL;
interface CategoryBriefInfoProps {
  category: CategoryDetail;
  mutate: () => void;
}

const CategoryBriefInfo = (props: CategoryBriefInfoProps) => {
  const { category, mutate } = props;
  const selectedKey = useSelector(selectedKeySelector);
  // const [rolePermission] = useRolePermission('category_operator');
  const { validate } = useKaniPermission();
  const rolePermission = validate('action_product_category_modify');
  const [visible, setVisible] = useState(false);
  const data = [
    {
      label: 'Local Name',
      value: category?.local_names?.map((item: CategoryRegionPair) => {
        return (
          <CategoryLocalName
            key={item.region}
            region={item.region}
            localName={item.local_name}
          />
        );
      }),
    },
    {
      label: 'Block Marketplace',
      value: (
        <Space>
          {category?.block_markets?.map((item: string) => {
            return <span key={item}>{item}</span>;
          })}
        </Space>
      ),
    },
    {
      label: 'Leaf Category',
      value: category?.is_leaf ? 'Yes' : 'No',
    },
    {
      label: 'Description',
      value: category?.description,
    },
  ];
  const isRoot = category.category_chain?.length === 1;
  const handleVisibleChange = () => {
    setVisible(!visible);
  };

  const handleClick = () => {
    setVisible(true);
  };
  const handleChangeCategoryStatus = async () => {
    const status =
      CategoryStatus.CATEGORY_ACTIVE === category.category_status
        ? CategoryStatus2.CategoryStatusSellerDeActive
        : CategoryStatus2.CategoryStatusActive;
    const request: UpdateCategoryStatusRequest = {
      category_ids: [category.category_id],
      status,
    };
    try {
      const res = await categoryRuleAPIClient.UpdateCategoryStatus(request);
      Message.success(res.message);
      mutate();
    } catch (error) {
      Message.error(error.message);
      mutate();
    }
  };
  const categoryOffline =
    category?.category_status === CategoryStatus.CATEGORY_OFFLINE &&
    category?.audit_status !== AuditStatus.Audit_QC_PENDING;
  return (
    <CategoryBriefInfoContainer>
      <div className="flex flex-col justify-between w-full">
        <div className="flex flex-col pl-24 pr-24">
          {category.category_status ===
            CategoryStatus.CATEGORY_SELLER_DEACTIVE &&
            !isRoot && (
              <div className="mr-8 overflow-hidden ">
                <StatusTag text="Blocked" color="Orange" />
              </div>
            )}
          <div className="inline-flex items-center justify-between ">
            <div className="flex flex-row w-2/3">
              <div className="mr-8 overflow-hidden ">
                <Text
                  textClassName="category-name"
                  content={category?.category_name}
                  position="bl"
                />
              </div>
              {categoryOffline ? (
                <StatusTag
                  text={CATEGORY_STATUS_MAP[category?.category_status]}
                  color={CATEGORY_COLOR_MAP[category?.category_status]}
                />
              ) : null}
              {category?.audit_status === AuditStatus.Audit_QC_PENDING ? (
                <StatusTag
                  text="Pending Approval"
                  color="Orange"
                  link={AUDIT_URL}
                />
              ) : null}
            </div>
            <Link
              onClick={() => {
                window.open(
                  `/common/record?target_id=${category.category_id}&target_type=17`,
                );
              }}>
              Operation History
            </Link>
          </div>
          <div className="flex  mt-6 text-gray-3 text-sm ">
            <IDContainer className="mr-8">{`Category ID: ${category?.category_id}`}</IDContainer>
            <PathContainer>
              <Text
                position="bl"
                content={`Category Path: ${category?.category_chain?.join(
                  ' > ',
                )}`}
              />
            </PathContainer>
          </div>
        </div>
        <div className="ml-24 mr-24">
          <Divider />
        </div>
        <div className="flex-col pl-24 pr-24">
          <div className="flex flex-row justify-between">
            <span className="text-gray-1 font-semibold">General Setting</span>
            {category?.audit_status !== AuditStatus.Audit_QC_PENDING &&
            rolePermission ? (
              <div>
                {!isRoot && !categoryOffline && (
                  <Popconfirm
                    title={`Sure to ${
                      category.category_status ===
                      CategoryStatus.CATEGORY_ACTIVE
                        ? 'block'
                        : 'cancel block'
                    } this category?`}
                    okText="Confirm"
                    onOk={() => {
                      handleChangeCategoryStatus();
                    }}>
                    <Button type="outline" style={{ marginRight: '20px' }}>
                      {category.category_status ===
                      CategoryStatus.CATEGORY_ACTIVE
                        ? 'Block'
                        : 'Cancel Block'}
                    </Button>
                  </Popconfirm>
                )}

                <Button type="outline" onClick={handleClick}>
                  Edit
                </Button>
              </div>
            ) : null}
          </div>
          <Descriptions
            className="mt-12"
            column={1}
            data={data}
            style={{ marginBottom: 20 }}
            labelStyle={{
              textAlign: 'left',
              paddingRight: 36,
              fontSize: 14,
              color: '#191D32',
              fontWeight: 600,
              paddingBottom: 15,
              verticalAlign: 'top',
            }}
          />
        </div>
      </div>
      <NewCategoryModal
        visible={visible}
        id={selectedKey?.toString()}
        type="edit"
        onVisibleChange={handleVisibleChange}
      />
    </CategoryBriefInfoContainer>
  );
};

export default CategoryBriefInfo;
