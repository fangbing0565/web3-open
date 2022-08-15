import React, { useState } from 'react';
import { IconToTop, IconPlus, IconMore } from '@arco-design/web-react/icon';
import { Tooltip, Menu, Dropdown, Button, Message } from '@i18n-ecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { RootDispatch, RootState } from '@/store';
import {
  SubmitCategoryFormRequest,
  categoryRuleAPIClient,
} from '@/api/operation/serv/oec_operation_category_rule_api';
import NewCategoryModal from '../new-category-modal';
import styles from './index.scss';

const TOOLTIP_CONTENT = {
  PACK_UP_ALL: 'Pack up all',
  NEW: 'New',
};

export const TreeHeader = () => {
  const {
    categoryTree: { setExpandedKeys, setCheckedKeys },
  } = useDispatch<RootDispatch>();
  const [visible, setVisible] = useState(false);

  const { expandedKeys, checkedKeys, selectedKey, status } = useSelector(
    (state: RootState) => state.categoryTree,
  );
  const handleSubmit = async () => {
    const request: SubmitCategoryFormRequest = {
      forms: checkedKeys.map(item => {
        return {
          title: '',
          category_id: item,
          description: '',
          link: '',
        };
      }),
    };
    if (checkedKeys.length > 5) {
      Message.error('Cannot submit more than 5 categories at a time');
      return;
    }
    try {
      const {
        code,
        data,
        message,
      } = await categoryRuleAPIClient.SubmitCategoryForm(request);
      if (code === 0) {
        if (data?.failed_ids) {
          Message.error(
            `${data?.failed_ids.toString()} category submit failed.`,
          );
        } else {
          Message.info('category submitted successfully');
        }
      } else {
        Message.error(message);
      }
    } catch (error) {
      const { message } = error;
      Message.error(message);
    }
  };

  const handleCancel = () => {
    setCheckedKeys([]);
  };

  const dropList = (
    <Menu>
      <Menu.Item key="submit" onClick={handleSubmit}>
        Submit
      </Menu.Item>
      <Menu.Item key="cancel" onClick={handleCancel}>
        Cancel
      </Menu.Item>
    </Menu>
  );

  const handleClickIconUp = () => {
    setExpandedKeys([]);
  };

  const handleNewCategory = () => {
    setVisible(true);
  };

  const handleVisibleChange = () => {
    setVisible(!visible);
  };
  return (
    <div className={styles.treeHeader}>
      <span className={styles.treeTag}>Category Tree </span>
      <div className={styles.treeHeaderButtonGroup}>
        <div className={styles.headerBtn}>
          <Tooltip
            mini={true}
            content={TOOLTIP_CONTENT.PACK_UP_ALL}
            position="bl">
            <IconToTop onClick={handleClickIconUp} />
          </Tooltip>
        </div>
        <div className={styles.headerBtn}>
          <Dropdown droplist={dropList} position="bl">
            <IconMore />
          </Dropdown>
        </div>
        <div className={styles.headerBtn}>
          <Tooltip mini={true} content={TOOLTIP_CONTENT.NEW} position="bl">
            <IconPlus onClick={handleNewCategory} />
          </Tooltip>
        </div>
      </div>
      {visible ? (
        <NewCategoryModal
          visible={visible}
          onVisibleChange={handleVisibleChange}
          type="new"
        />
      ) : null}
    </div>
  );
};
