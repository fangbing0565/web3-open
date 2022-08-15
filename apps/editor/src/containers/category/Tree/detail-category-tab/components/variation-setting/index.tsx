import React, { useState, useEffect } from 'react';
import { useURLSearch } from '@i18n-ecom-op/hooks';
import { CategoryProperty } from '@/api/operation/data/category_rule';
import {
  categoryRuleAPIClient,
  CategoryPropertyUpdateType,
} from '@/api/operation/serv/oec_operation_category_rule_api';
import { Message } from '@arco-design/web-react';
import { RESPONSE_CODE } from '@/containers/rule-management/constants';
import { Input, Modal, Tag } from '@i18n-ecom/ui';
import { AddIcon, DeleteIcon } from '@i18n-ecom/ui-icon';
import styles from './index.scss';

const InputSearch = Input.Search;

const VariationSetting = () => {
  const [{ category_id }] = useURLSearch();
  const [selectedProperties, setSelectedProperties] = useState<
    CategoryProperty[]
  >();
  const [allProperties, setAllProperties] = useState<CategoryProperty[]>();
  const curPropertyID = selectedProperties?.map(item => item.property_id);
  // 如果curPropertyID不存在，那么也可以分配
  const canBind =
    !curPropertyID || (curPropertyID && curPropertyID?.length < 2);

  const listCategoryProperty = async () => {
    try {
      const res = await categoryRuleAPIClient.CategoryPropertyList({
        category_id,
        get_sale_property: true,
      });
      const { code, data } = res;
      if (code === RESPONSE_CODE.SUCCESS) {
        setSelectedProperties(data?.properties);
      }
    } catch (e) {
      Message.error(e.message);
    }
  };

  const listAllProperty = async (propertyName?: string) => {
    try {
      const res = await categoryRuleAPIClient.CategoryPropertySearch({
        property_name: propertyName,
      });
      const { code, data } = res;
      if (code === RESPONSE_CODE.SUCCESS) {
        setAllProperties(data?.properties);
      }
    } catch (e) {
      Message.error(e.message);
    }
  };

  const updateCategory = async (
    actionType: CategoryPropertyUpdateType,
    property_id: string,
  ) => {
    const action =
      actionType === CategoryPropertyUpdateType.CategoryPropertyUpdateTypeBind
        ? 'bind'
        : 'unbind';
    try {
      const res = await categoryRuleAPIClient.CategoryPropertyUpdate({
        category_id,
        property_id,
        op_type: actionType,
      });
      const { code } = res;
      if (code === RESPONSE_CODE.SUCCESS) {
        Message.success(`Successfully ${action}ed property.`);
        await listCategoryProperty();
      }
    } catch (e) {
      Message.error(e.message);
    }
  };

  const handleClick = (
    actionType: CategoryPropertyUpdateType,
    property_id: string,
  ) => {
    const action =
      actionType === CategoryPropertyUpdateType.CategoryPropertyUpdateTypeBind
        ? 'bind'
        : 'unbind';
    const confrimModal = Modal.confirm({
      title: 'Confirm Operation',
      content: `Are you sure you want to ${action} this property?`,
      onOk: async () => {
        await updateCategory(actionType, property_id);
        confrimModal.close();
      },
      okText: 'Yes',
    });
  };

  useEffect(() => {
    listCategoryProperty();
    listAllProperty();
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <InputSearch
          allowClear={true}
          className={styles.inputSearch}
          placeholder={'Enter name to search'}
          onSearch={(value: string) => {
            listAllProperty(value);
          }}
        />
        <div className={styles.tagWrapper}>
          {allProperties
            ?.filter(item => !curPropertyID?.includes(item.property_id))
            ?.map(item => {
              return (
                <Tag
                  className={styles.tag}
                  key={item.property_id}
                  onClick={() => {
                    if (item.property_id) {
                      handleClick(
                        CategoryPropertyUpdateType.CategoryPropertyUpdateTypeBind,
                        item.property_id,
                      );
                    }
                  }}
                  color={canBind ? 'blue' : 'gray'}
                  icon={<AddIcon />}>
                  {item.property_name}
                </Tag>
              );
            })}
        </div>
        <div className={styles.tagWrapper}>
          <div>{`Selected ${
            curPropertyID && curPropertyID.length === 1 ? 'Option' : 'Options'
          }`}</div>
          {selectedProperties?.map(item => {
            return (
              <Tag
                style={{ margin: '0 8px 8px 0' }}
                key={item.property_id}
                color="orange"
                icon={<DeleteIcon />}
                onClick={async () => {
                  if (item.property_id) {
                    handleClick(
                      CategoryPropertyUpdateType.CategoryPropertyUpdateTypeUnbind,
                      item.property_id,
                    );
                  }
                }}>
                {item.property_name}
              </Tag>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default VariationSetting;
