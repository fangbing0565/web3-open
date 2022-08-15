import React, { useEffect, useState } from 'react';
import Card from '@/components/card';
import BasicDescription, {
  DataType,
} from '@i18n-ecom-op/components/selection-components/basic-description';
import { FeCategoryTree } from '@/api/operation/data/category_rule';
import { useCommonParam } from '@i18n-ecom-op/hooks';
import { useParams } from 'react-router-dom';
import { GetCategoryTree } from '../../fetchers';
import styles from './index.scss';

interface IParam {
  tree_id?: string;
}
const BasicCommon = () => {
  const [{ oec_region }] = useCommonParam();
  const [treeInfo, setTreeInfo] = useState<FeCategoryTree>();
  const { tree_id } = useParams<IParam>();
  // console.log('tree_id:', tree_id, typeof tree_id);

  useEffect(() => {
    GetCategoryTree(oec_region, { tree_id, current: 1, pageSize: 50 }).then(
      res => {
        const { data } = res;
        if (data && data?.length > 0) {
          setTreeInfo(data[0]);
        }
      },
    );
  }, []);

  // useEffect(() => {
  //   console.log(treeInfo, 'state changed');
  // }, [treeInfo]);

  const getBasicDescData = (): DataType[] => {
    return [
      {
        label: 'Front-end Category Tree Name',
        value: treeInfo?.name ?? '-',
        tooTip: true,
      },
      {
        label: 'Front-end Category Tree ID',
        value: treeInfo?.tree_id ?? '—',
      },
      {
        label: 'Front-end Category Tree Description',
        value: treeInfo?.desc ?? '-',
        tooTip: true,
      },
    ];
  };

  return (
    <>
      <Card className={styles.basicInfo}>
        <BasicDescription data={getBasicDescData()} num={3} />
      </Card>
    </>
  );
};

export default BasicCommon;
