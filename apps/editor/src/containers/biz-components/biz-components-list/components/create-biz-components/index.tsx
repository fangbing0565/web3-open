import React, { useEffect, useState } from 'react';
import Modal from '@arco-design/web-react/es/Modal';
import ProForm from '@m4b-design/pearl-pro-form';
import { Input, Message } from '@arco-design/web-react';
import Select from '@m4b-design/select';

import {
  BizComponentGroupStatus,
  pageConfigAPIClient,
} from '@/api/operation/serv/oec_operation_form_page_api';
import { useBizType } from '@/utils/fetch-biz-type';
import styles from '../../index.scss';

type CreateBizComponentsType = {
  submitSuccess: (res: any) => void;
  onCancel: () => void;
  visible: boolean;
};

const CreateBizComponents: React.FC<
  React.PropsWithChildren<CreateBizComponentsType>
> = ({ visible, submitSuccess, onCancel }) => {
  const [formRef] = ProForm.useForm();
  const [loading, setLoading] = useState(false);
  const [bizTypeList] = useBizType();

  useEffect(() => {
    formRef.clearFields();
    formRef.resetFields();
  }, [visible]);
  useEffect(() => {}, [bizTypeList]);

  return (
    <Modal
      wrapClassName={styles.modalWrapper}
      onCancel={onCancel}
      maskStyle={{ zIndex: 999 }}
      confirmLoading={loading}
      onConfirm={() => {
        formRef.validate(err => {
          if (!err) {
            setLoading(true);
            const i18n_key = formRef.getFieldValue('i18n_key');
            const name_space = formRef.getFieldValue('name_space');
            let page_options = '';
            if (i18n_key && name_space) {
              page_options = JSON.stringify({
                i18n_key,
                name_space,
              });
            }
            const biz_component_group = {
              id: '',
              name: String(formRef.getFieldValue('name')),
              description: formRef.getFieldValue('description') || '',
              content: JSON.stringify({}),
              biz_type: formRef.getFieldValue('bizType'),
              owner: '',
              create_time: 0,
              update_time: 0,
              biz_component_group_status: BizComponentGroupStatus.NORMAL,
              sdk_version: '1',
              sdk_url: '',
              page_options,
            } as any;

            pageConfigAPIClient
              .CreateBizComponentGroup({
                biz_component_group,
              })
              .then(res => {
                Message.success('Create biz component group success!');
                submitSuccess?.(res);
              })
              .catch(err => {
                Message.error(err.message);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        });
      }}
      visible={visible}
      title="Create Biz Comoponent"
      okText="Confirm"
      cancelText="Cancel">
      <ProForm form={formRef}>
        <ProForm.Item
          field="bizType"
          label="biz component type"
          required={true}>
          <Select placeholder="select biz component type" size="default">
            {bizTypeList.map(bizType => (
              <Select.Option
                key={bizType.biz_type_key}
                value={bizType.biz_type_id}>
                {bizType.biz_type_label}
              </Select.Option>
            ))}
          </Select>
        </ProForm.Item>
        <ProForm.Item field="name" label="name" required={true}>
          <Input placeholder="input name" />
        </ProForm.Item>
        <ProForm.Item field="description" label="description">
          <Input placeholder="input description" />
        </ProForm.Item>
        <ProForm.Item
          field="i18n_key"
          label="i18n api key"
          rules={[
            {
              validator: (_, cb) => {
                if (
                  formRef.getFieldValue('name_space') &&
                  !formRef.getFieldValue('i18n_key')
                ) {
                  return cb('please input i18n api key!');
                }
                return cb();
              },
            },
          ]}>
          <Input placeholder="input i18n api key" />
        </ProForm.Item>
        <ProForm.Item
          field="name_space"
          label="i18n name space"
          rules={[
            {
              validator: (_, cb) => {
                if (
                  !formRef.getFieldValue('name_space') &&
                  formRef.getFieldValue('i18n_key')
                ) {
                  return cb('please input i18n name space!');
                }
                return cb();
              },
            },
          ]}>
          <Input placeholder="input i18n name space" />
        </ProForm.Item>
      </ProForm>
    </Modal>
  );
};

export default CreateBizComponents;
