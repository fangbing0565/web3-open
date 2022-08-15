import React, { useEffect, useState } from 'react';
import Modal from '@arco-design/web-react/es/Modal';
import ProForm from '@m4b-design/pearl-pro-form';
import { Input, Message, Select } from '@arco-design/web-react';
import {
  BizComponentGroup,
  pageConfigAPIClient,
  PageOnlineStatus,
  PageType,
} from '@/api/operation/serv/oec_operation_form_page_api';
import { IFormPage } from '@oec-open/ttspc-render';
import { useBizType } from '@/utils/fetch-biz-type';
import styles from '../../index.scss';

type CreatePageType = {
  submitSuccess: (res: any) => void;
  onCancel: () => void;
  visible: boolean;
};

const CreatePage: React.FC<React.PropsWithChildren<CreatePageType>> = ({
  visible,
  submitSuccess,
  onCancel,
}) => {
  const [formRef] = ProForm.useForm();
  const [loading, setLoading] = useState(false);
  const [bizCompList, setBizCompList] = useState<BizComponentGroup[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    pageConfigAPIClient
      .QueryBizComponentGroup({})
      .then(res => {
        setBizCompList(res.biz_component_group || []);
      })
      .finally(() => {
        setLoadingList(false);
      });
  }, []);

  useEffect(() => {
    formRef.clearFields();
    formRef.resetFields();
  }, [visible]);

  return (
    <Modal
      wrapClassName={styles.modalWrapper}
      maskStyle={{ zIndex: 999 }}
      onCancel={onCancel}
      confirmLoading={loading}
      onConfirm={() => {
        formRef.validate(err => {
          console.log({ err });
          if (!err) {
            console.log(formRef.getFieldsValue());
            setLoading(true);
            const bizGroupId = formRef.getFieldValue('bizGroupId');
            const curBiz = bizCompList.find(i => i.id === bizGroupId);

            const i18n_key = formRef.getFieldValue('i18n_key');
            const name_space = formRef.getFieldValue('name_space');
            let page_options = '';
            if (i18n_key && name_space) {
              page_options = JSON.stringify({
                i18n_key,
                name_space,
              });
            }

            const page = {
              name: String(formRef.getFieldValue('name')),
              description: formRef.getFieldValue('description') || '',
              page_type: PageType.FORM,
              page_online_status: PageOnlineStatus.ONLINE,
              id: '',
              key: '',
              owner: '',
              create_time: 0,
              update_time: 0,
              sdk_url: '',
              page_code: '',
              version: 1,
              biz_component_group_ids: [bizGroupId],
              sdk_version: '1',
              biz_type: curBiz?.biz_type,
              page_options,
              content: JSON.stringify({
                body: {
                  gutter: 16,
                  sections: [
                    {
                      type: 'section',
                      title: 'Section Title',
                      nodeId: 'id_1',
                      layout: 'vertical',
                      mode: 'search',
                      colSpan: {
                        span: 24,
                      },
                      children: [
                        {
                          type: 'input',
                          label: 'Input Label',
                          bizType: 0,
                          nodeId: 'id_5',
                          field: 'id_5',
                          customProps: {
                            options: ['option1', 'option2'],
                            placeholder: 'placeholder',
                            trigger: 'hover',
                          },
                        },
                      ],
                    },
                  ],
                },
              } as IFormPage),
            } as any;

            pageConfigAPIClient
              .CreatePage({
                page,
              })
              .then(res => {
                Message.success('Create page success!');
                submitSuccess?.(res);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        });
      }}
      visible={visible}
      title="Create Page"
      okText="Confirm"
      cancelText="Cancel">
      <ProForm
        form={formRef}
        onSubmit={val => {
          console.log({ val });
        }}>
        <ProForm.Item
          field="bizGroupId"
          label="biz component group"
          required={true}>
          <Select
            placeholder="select biz component type"
            size="default"
            onChange={val => {
              console.log({ val });
              const curBizType = bizCompList.find(i => i.id === val);
              console.log({ curBizType });
              if (curBizType?.page_options) {
                try {
                  const { i18n_key, name_space } = JSON.parse(
                    curBizType.page_options,
                  );
                  formRef.setFieldsValue({
                    i18n_key,
                    name_space,
                  });
                } catch (error) {
                  formRef.setFieldsValue({
                    i18n_key: '',
                    name_space: '',
                  });
                }
              } else {
                formRef.setFieldsValue({
                  i18n_key: '',
                  name_space: '',
                });
              }
            }}
            loading={loadingList}>
            {bizCompList.map(bizType => (
              <Select.Option key={bizType.id} value={bizType.id}>
                {bizType.name}
              </Select.Option>
            ))}
          </Select>
        </ProForm.Item>
        <ProForm.Item field="name" label="name" required={true}>
          <Input placeholder="input description" />
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

export default CreatePage;
