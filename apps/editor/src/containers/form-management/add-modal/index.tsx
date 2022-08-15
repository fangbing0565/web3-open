import React, { useState, useEffect } from 'react';
import {
  pageConfigAPIClient,
  Page,
  PageOnlineStatus,
} from '@/api/operation/serv/oec_operation_form_page_api';
import {
  KeyType,
  partnerOpAPIClient,
} from '@/api/operation/serv/oec_operation_partner_op_api';
import { FormInstance } from '@arco-design/web-react/es/Form';
import Steps from '@m4b-design/steps';
import ProForm from '@m4b-design/pearl-pro-form';
import { Button, Modal, Select, Message } from '@i18n-ecom/ui';
import { useContextUser } from '@i18n-ecom-op/hooks';
import { Link } from 'react-router-dom';
import { PAGE_PATH_LIST } from '@/constants/page-components';
import { stepList, modalFormLabel } from './constens';
import AccountTable from './components/account-table';
import styles from './index.scss';

const Step = (Steps as any).Step;
const Option = Select.Option;
const AddModal = ({
  visible,
  onCancel,
  listForm,
  currOptions,
}: {
  visible: boolean;
  onCancel: () => void;
  listForm: FormInstance;
  currOptions: any;
}) => {
  const [userInfo] = useContextUser();
  const [step, setstep] = useState(1);
  const [formRef] = ProForm.useForm();
  const [getFormId, setGetFormId] = useState('');
  const [getPageCode, setPageCode] = useState<string>('');
  const [selectDisabled, setSelectDisabled] = useState(true);
  const [selectedRow, setSelectedRow] = useState<Array<any>>([]);
  const [selectedRowkeys, setSelectedRowkeys] = useState<Array<string>>([]);
  const [getOptions, setGetOptions] = useState<Page[]>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFirstStep = () => {
    setstep(2);
  };

  const handleCancel = () => {
    onCancel();
    setstep(1);
    setSelectedRow([]);
    setSelectedRowkeys([]);
    setSelectDisabled(true);
    formRef.clearFields('partner_country_code');
    formRef.clearFields('category_id');
    formRef.clearFields('seller_market');
  };

  const getSelected = (selectedRow: Array<any>) => {
    setSelectedRow(selectedRow);
  };

  const getSelectedRowsKeys = (SelectedRowsKeys: Array<string>) => {
    setSelectedRowkeys(SelectedRowsKeys);
  };

  const handleBack = () => {
    setstep(1);
  };

  const footerDom = () => {
    return (
      <>
        {step === 1 ? (
          <>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              disabled={!(selectedRow.length > 0)}
              onClick={handleFirstStep}>
              Next
            </Button>
          </>
        ) : (
          <div className={styles.footerBtnWrap}>
            <Button onClick={handleBack}>Back</Button>
            <div>
              <Button onClick={handleCancel} className={styles.cancelBtn}>
                Cancel
              </Button>
              <Button
                disabled={selectDisabled}
                type="primary"
                loading={isLoading}
                onClick={handleCreate}
                style={{ marginRight: '5px' }}>
                Confirm
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  const handleCreate = () => {
    setIsLoading(true);
    const params = {
      keys: selectedRowkeys,
      key_type: KeyType.AREA_RULE,
      page_code: getPageCode,
    };
    partnerOpAPIClient
      .CreateFormRelation(params)
      .then(res => {
        if (res.code === 0) {
          Message.success(res.message);
          handleCancel();
          listForm.submit();
          setIsLoading(false);
          formRef.resetFields();
        } else {
          Message.error(res.message);
          setIsLoading(false);
          formRef.resetFields();
        }
      })
      .catch(err => {
        Message.error(err.message);
        setIsLoading(false);
      });
  };

  const getOnboardingForm = () => {
    const params = {
      owner: (userInfo as any)?.email?.split('@')?.[0] || '',
      page_online_status: PageOnlineStatus.ONLINE,
    };
    pageConfigAPIClient
      .QueryPage(params)
      .then(res => {
        setGetOptions(res.pages);
      })
      .catch(err => {
        Message.error(err.message);
      });
  };

  const handleSelect = (val: string, option: any) => {
    if (option._key && val) {
      setSelectDisabled(false);
      setGetFormId(option._key);
      setPageCode(val);
    }
  };

  useEffect(() => {
    getOnboardingForm();
  }, []);

  return (
    <Modal
      title="Add Market"
      style={{ width: '752px' }}
      visible={visible}
      onCancel={handleCancel}
      autoFocus={false}
      footer={footerDom}
      unmountOnExit={true}
      focusLock={true}>
      <div className={styles.stepsWrap}>
        <Steps current={step}>
          {stepList.map(title => (
            <Step title={title} key={title} />
          ))}
        </Steps>
      </div>

      <div style={{ display: step === 1 ? 'unset' : 'none' }}>
        <AccountTable
          currOptions={currOptions}
          getSelected={getSelected}
          selectedRowkeys={selectedRowkeys}
          getSelectedRowsKeys={getSelectedRowsKeys}
        />
      </div>
      <div style={{ display: step === 2 ? 'unset' : 'none' }}>
        <div
          className={
            styles.marketsText
          }>{`${selectedRow?.length} ${modalFormLabel.marketsSelected}`}</div>
        <div className={styles.marketsWrap}>
          {selectedRow?.length > 0 &&
            selectedRow?.map(item => {
              const markts = item?.service_area_rule;
              return (
                <span
                  className={styles.itemMarkts}
                  key={
                    markts.id
                  }>{`${markts?.partner_country.code} - ${markts?.category?.category_name} - ${markts?.seller_market?.code}`}</span>
              );
            })}
        </div>
        <ProForm
          form={formRef}
          wrapperCol={{ span: 24 }}
          labelAlign="left"
          style={{ width: '100%' }}>
          <ProForm.Item
            field="page_code"
            label={modalFormLabel.onboardingForm}
            required={true}>
            <Select
              className={styles.selectWrap}
              placeholder="Enter form name"
              onChange={(val, option) => handleSelect(val, option)}>
              {getOptions &&
                getOptions?.map(option => (
                  <Option key={option.id} value={option.page_code}>
                    <span>{option.name}</span>
                    <span className={styles.message}>
                      {option.owner}
                      {option.update_time
                        ? ` updated on ${option.update_time}`
                        : ` created on${option.create_time}`}
                    </span>
                  </Option>
                ))}
            </Select>
            {selectDisabled ? (
              <Link
                className="no-underline text-brand font-semibold"
                to={PAGE_PATH_LIST.pageComponentPreviewPath + getFormId}>
                <Button className={styles.previewBtn}>Preview</Button>
              </Link>
            ) : (
              ''
            )}
          </ProForm.Item>
          <Link
            className={`${styles.viewBtn} no-underline`}
            to={PAGE_PATH_LIST.pageComponentsListPath}>
            View all forms
          </Link>
        </ProForm>
      </div>
    </Modal>
  );
};

export default AddModal;
