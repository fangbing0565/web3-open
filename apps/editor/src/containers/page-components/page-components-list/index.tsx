import React, { useEffect, useState } from 'react';
import PageTable, { useQuery } from '@m4b-design/pearl-page-table';
import ProForm from '@m4b-design/pearl-pro-form';
import ComponentMiddle from '@/components/component-middle';
import { PageOnlineStatus } from '@/api/operation/serv/oec_operation_form_page_api';
import { useContextUser, useURLSearch } from '@i18n-ecom-op/hooks';
import { useHistory, useLocation } from '@jupiter/plugin-runtime/router';
import { PAGE_PATH, PAGE_PATH_LIST } from '@/constants/page-components';
import { useBizType } from '@/utils/fetch-biz-type';
import pageComponentsColumns from './utils/pageComponentsColumns';
import { getOptions } from './utils/options';
import { getPageList } from './utils/getPageList';
import { PageTab } from './components/page-tab';
import styles from './index.scss';
import CreatePage from './components/create-page';
import { pageOnlineStatus } from './constants';

const PageComponentsList: React.FC = () => {
  const [formRef] = ProForm.useForm();
  const [pageTab, setPageTab] = useState<any>(PageOnlineStatus.ONLINE);
  const [searchParams, setSearchParams] = useURLSearch();
  const [{ userInfo }] = useContextUser();
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const [bizTypeList] = useBizType();

  // 路由上的tab随tab切换而改变
  useEffect(() => {
    if (
      searchParams &&
      searchParams.tab &&
      pageOnlineStatus.find(item => item.value === Number(searchParams.tab))
    ) {
      setPageTab(Number(searchParams.tab));
      formRef.submit();
    }
  }, []);

  const handleReset = () => {
    formRef.resetFields();
    formRef.submit();
  };

  const handleTabChange = (key: string) => {
    setSearchParams({ ...searchParams, tab: key });
    setPageTab(Number(key));
    formRef.submit();
  };

  return (
    <div className={styles.wrapper}>
      <CreatePage
        onCancel={() => setVisible(false)}
        visible={visible}
        submitSuccess={res => {
          setVisible(false);
          const { page_id } = res;
          history.push(PAGE_PATH_LIST.pageComponentEditPath + page_id);
        }}
      />
      <div className={styles.pageTab}>
        <PageTab onChange={handleTabChange} value={pageTab} />
      </div>
      <PageTable
        form={{
          form: formRef,
          options: getOptions(bizTypeList),
          onReset: handleReset,
          buttonProps: {
            list: [
              {
                type: 'submit',
                text: 'Search',
                styleType: 'primary',
              },
              {
                type: 'reset',
                text: 'Reset',
              },
            ],
          },
        }}
        Middle={({ searchResult }) => (
          <ComponentMiddle
            total={searchResult.total}
            middleText={'Pages'}
            handleCreate={() => {
              setVisible(true);
            }}
          />
        )}
        table={{
          columns: pageComponentsColumns({
            formRef,
            pageTab,
            email: userInfo?.email,
            bizTypeList,
          }),
          rowKey: 'id',
          pagination: {
            defaultPageSize: 10,
          },
        }}
        fetcher={async (query: Record<string, any>) =>
          getPageList(query, pageTab)
        }
      />
    </div>
  );
};
export default PageComponentsList;
