import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NodeProps } from '@arco-design/web-react/es/Tree/interface';
import { Tree } from '@i18n-ecom/ui';
import { RootDispatch, select, RootState } from '@/store';
import { TreeSelect } from '@arco-design/web-react';
import { IconDown } from '@arco-design/web-react/icon';
import { useTreeData } from '../../tree-content/hooks/useTreeData';
import styles from './index.scss';
import { TreeSelectContainer } from './styles';
import { TreeItemTitle as renderTitle } from './components';

const generatorTreeNodes = (treeData: any[]) => {
  return treeData.map(item => {
    const { children, key, ...rest } = item;
    return (
      <Tree.Node className={styles.treeNode} key={key} {...rest} dataRef={item}>
        {children ? generatorTreeNodes(item.children) : null}
      </Tree.Node>
    );
  });
};

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}
export const CategorySelect = (props: CategorySelectProps) => {
  // const [value, setValue] = useState('node2');
  const { value, onChange } = props;

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const {
    requestAllCategories,
    requestChildrenCategories,
    categoryTree: {
      setExpandedKeys,
      updateSelectedKey,
      setExpandedKeysForSelect,
      updateSelectedKeyForSelect,
    },
  } = useDispatch<RootDispatch>();
  const loading = useSelector<{}, boolean>(
    select.requestAllCategories.loadingSelector,
  );
  const { expandedKeys, selectedKey, status } = useSelector(
    (state: RootState) => state.categoryTree,
  );
  const [treeData] = useTreeData();

  const loadMore = async (treeNode: NodeProps, dataRef: any) => {
    //@ts-ignore
    const id = treeNode.key;
    if (id) {
      setExpandedKeys([...expandedKeys, id]);
      await requestChildrenCategories.load(id);
    }
  };

  const handleChange = (value: string) => {
    onChange(value);
  };

  const handleExpand = (keys: string[]) => {
    setExpandedKeys(keys);
  };

  return (
    <TreeSelectContainer>
      <TreeSelect
        placeholder="Please choose category"
        allowClear={true}
        value={value === '0' ? undefined : value}
        treeProps={{
          expandedKeys,
          onExpand: handleExpand,
          renderTitle,
        }}
        loadMore={loadMore}
        onChange={handleChange}
        triggerProps={{
          getPopupContainer: (node: any) => node,
          autoAlignPopupWidth: true,
        }}>
        {generatorTreeNodes(treeData)}
      </TreeSelect>
    </TreeSelectContainer>
  );
};
