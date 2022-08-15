import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  NodeInstance,
  NodeProps,
} from '@arco-design/web-react/es/Tree/interface';
import { Spin, Empty, Tree } from '@i18n-ecom/ui';
import { RootDispatch, select, RootState } from '@/store';
import { AuditStatus } from '@/api/operation/data/category_rule';
import { ListOPChildCategoriesRequest } from '@/api/operation/serv/oec_operation_category_rule_api';
import { useTreeData } from './hooks';
import {
  TreeItemExtra as renderExtra,
  TreeItemTitle as renderTitle,
} from './components';
import styles from './index.scss';

type RequestCategoryType = NodeProps & ListOPChildCategoriesRequest;

const generatorTreeNodes = (treeData: any[]) => {
  return treeData.map(item => {
    const { children, category_name, isLeaf, key, ...rest } = item;
    return (
      <Tree.Node
        className={styles.treeNode}
        key={key}
        isLeaf={isLeaf}
        {...rest}
        disableCheckbox={!isLeaf}>
        {children ? generatorTreeNodes(item.children) : null}
      </Tree.Node>
    );
  });
};

export const TreeContent = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const {
    requestAllCategories,
    requestChildrenCategories,
    categoryTree: { setExpandedKeys, updateSelectedKey, setCheckedKeys },
  } = useDispatch<RootDispatch>();
  const loading = useSelector<{}, boolean>(
    select.requestAllCategories.loadingSelector,
  );
  const { expandedKeys, checkedKeys, selectedKey, status } = useSelector(
    (state: RootState) => state.categoryTree,
  );
  const [treeData] = useTreeData();

  React.useEffect(() => {
    if (status === 6) {
      requestAllCategories.load({ audit_status: AuditStatus.Audit_QC_PENDING });
    } else {
      requestAllCategories.load({ category_status: status });
    }
    return () => {
      requestAllCategories.init();
    };
  }, [status]);

  const handleExpand = (keys: string[]) => {
    setExpandedKeys(keys);
  };

  const handleSelect = React.useCallback((keys: string[]) => {
    updateSelectedKey(keys[keys.length - 1]);
  }, []);

  const handleCheck = (checkedKeys: string[]) => {
    setCheckedKeys(checkedKeys);
  };

  const loadMore = async (props: NodeInstance) => {
    const requestCategory: RequestCategoryType = props.props;
    const { _key: id } = requestCategory;
    const requestParams: any = { id };
    if (status === 6) {
      requestParams.audit_status = AuditStatus.Audit_QC_PENDING;
    } else if (status) {
      requestParams.category_status = status;
    }
    if (id) {
      await requestChildrenCategories.load(requestParams);
    }
  };

  return (
    <div className={styles.treeContainer} ref={wrapperRef}>
      {loading ? (
        <div className={styles.spinWrapper}>
          <Spin />
        </div>
      ) : (
        <Tree
          height={wrapperRef.current?.offsetHeight || 600}
          expandedKeys={expandedKeys}
          multiple={true}
          checkable={true}
          selectedKeys={[selectedKey]}
          onSelect={handleSelect}
          onExpand={handleExpand}
          checkedKeys={checkedKeys}
          onCheck={handleCheck}
          loadMore={loadMore}
          renderTitle={renderTitle}
          renderExtra={renderExtra}>
          {generatorTreeNodes(treeData)}
        </Tree>
      )}
      {!loading && treeData.length === 0 && <Empty />}
    </div>
  );
};
