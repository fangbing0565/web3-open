import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Message, Tooltip } from '@i18n-ecom/ui';
import { select } from '@/store';
import {
  EasyForm,
  EasyFormOption,
  FORM_ITEM_TYPE,
} from '@i18n-ecom-op/components';
import { IS_LEAF_LIST } from '@/constants/category';
import {
  categoryRuleAPIClient,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/api/operation/serv/oec_operation_category_rule_api';
import { useSelector } from 'react-redux';
import { CategoryRegionPair } from '@/api/operation/data/category_rule';
import { useRegionList } from '@i18n-ecom-op/api-hooks';
import { useConfigContext } from '@m4b-design/pearl-config-provider';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { useTreeData } from '../tree-content/hooks';
import { ModalContainer, QuestionTips } from './styled';
import { CategorySelect } from './category-select';

interface NewCategoryModalProps {
  visible: boolean;
  id?: string;
  type: string;
  onVisibleChange: () => void;
}

const NewCategoryModal = (props: NewCategoryModalProps) => {
  const {
    regionConfig: { regionList },
  } = useConfigContext();
  const { getRegionInfo } = useRegionList();
  const { visible, type, id, onVisibleChange } = props;
  const [formRef] = Form.useForm();
  const [isEditLocalName, setIsEditLocalName] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [categoryName, setCategoryName] = useState<string>();
  const [category, setCategoryList] = useState<any[]>();
  const [treeData] = useTreeData();

  useEffect(() => {
    setCategoryList(treeData);
  }, [treeData]);

  const nameValidator = (value: string, callback: (error: string) => void) => {
    if (!value) {
      return;
    }
    if (/[\u4E00-\u9FA5]/g.test(value)) {
      // eslint-disable-next-line consistent-return
      return callback('name cannot be Chinese!');
    }
  };

  const categoryDetailResponse = useSelector(
    select.getCategoryDetail.dataSelector,
  );
  const categoryDetailInfo = categoryDetailResponse?.data?.base_info;

  useEffect(() => {
    if (isEditLocalName && type === 'edit') {
      if (categoryDetailInfo?.local_names) {
        for (const local_names of categoryDetailInfo?.local_names) {
          const field_name = `local_name_${
            getRegionInfo(local_names.region)?.region || local_names.region
          }`;
          formRef.setFieldValue(field_name, local_names?.local_name);
        }
      }
    } else {
      formRef.setFieldValue('local_name_UK', categoryName);
    }
  }, [isEditLocalName, categoryDetailInfo]);

  useEffect(() => {
    formRef.setFieldValue('local_name_UK', categoryName);
  }, [categoryName]);

  useEffect(() => {
    if (type === 'edit') {
      formRef.setFieldsValue({
        category_name: categoryDetailInfo?.category_name,
        leaf_category: categoryDetailInfo?.is_leaf,
        description: categoryDetailInfo?.description,
        edit_local_name: true,
        parent_category: categoryDetailInfo?.parent_id,
      });
    }
  }, [id, categoryDetailInfo]);

  const localNameOptions: EasyFormOption[] = regionList
    .filter(item => item.region !== 'UNIVERSAL')
    .map(item => {
      return {
        label: item.text,
        type: FORM_ITEM_TYPE.INPUT,
        field: `local_name_${item.region}`,
        submitWhenChange: false,
        customOptions: {
          allowClear: true,
          placeholder: 'Please enter local name',
          maxLength: 200,
          showWordLimit: true,
          // disabled: item.region === 'GB',
        },
        rules: [
          {
            validator: nameValidator,
          },
        ],
        colSpan: {
          span: 18,
        },
      };
    });

  const easyFormOption: EasyFormOption[] = [
    {
      label: 'Category Name',
      type: FORM_ITEM_TYPE.INPUT,
      field: 'category_name',
      submitWhenChange: false,
      customOptions: {
        allowClear: true,
        placeholder: 'Please enter category name',
        maxLength: 200,
        showWordLimit: true,
        disabled: Boolean(id),
        onChange: (value: string) => {
          setCategoryName(value);
        },
      },
      colSpan: {
        span: 18,
      },
      rules: [
        {
          validator: nameValidator,
        },
        {
          required: true,
          message: "Category name can't be empty.",
        },
      ],
    },
    {
      label: 'Edit Local Name',
      type: FORM_ITEM_TYPE.SWITCH,
      field: 'edit_local_name',
      submitWhenChange: false,
      customOptions: {
        onChange: (value: boolean) => {
          setIsEditLocalName(value);
        },
      },
      colSpan: {
        span: 18,
      },
      rules: [
        {
          required: true,
          message: "Promotion name can't be empty.",
        },
      ],
    },
    {
      label: 'Parent Category',
      type: CategorySelect,
      field: 'parent_category',
      submitWhenChange: false,
      customOptions: {
        // allowClear: true,
        // placeholder: 'Please choose category',
        // treeData: category,
      },
      colSpan: {
        span: 18,
      },
      // rules: [
      //   {},
      //   {
      //     required: true,
      //     message: "Parent category can't be empty.",
      //   },
      // ],
    },
    {
      label: (
        <div className="inline-flex items-center">
          Leaf Category
          <Tooltip
            trigger="hover"
            content="Leaf category cannot be further classified">
            <QuestionTips width={18} height={18} className="ml-2" />
          </Tooltip>
        </div>
      ),
      type: FORM_ITEM_TYPE.RADIO,
      field: 'leaf_category',
      submitWhenChange: false,
      customOptions: {
        list: IS_LEAF_LIST.map(item => {
          return {
            name: item,
            value: item === 'Yes',
          };
        }),
        customOptions: {
          disabled: Boolean(id),
        },
      },
      colSpan: {
        span: 18,
      },
      rules: [
        {
          required: true,
          message: `Is leaf category can't be empty.`,
        },
      ],
    },
    {
      label: 'Description',
      type: FORM_ITEM_TYPE.TEXT_AREA,
      field: 'description',
      submitWhenChange: false,
      colSpan: {
        span: 18,
      },
      customOptions: {
        placeholder: 'Please input the reason for adding the configuration',
        maxLength: 200,
        showWordLimit: true,
      },
      // rules: [
      //   {
      //     required: true,
      //     message: 'Please add shops to the promotion.',
      //   },
      // ],
    },
  ];

  const handleClick = async () => {
    const formValues = formRef.getFieldsValue();
    if (
      formValues.leaf_category === true &&
      typeof formValues.parent_category === 'undefined'
    ) {
      Message.error('Please choose parent category.');
      return;
    }
    if (id) {
      const regionName: CategoryRegionPair[] = [];
      regionList
        .filter(item => item.region !== 'UNIVERSAL')
        .forEach(item => {
          if (formValues[`local_name_${item.region}`]) {
            regionName.push({
              region: item.region,
              local_name: formValues[`local_name_${item.region}`],
            });
          }
        });
      const updateCategoryRequest: UpdateCategoryRequest = {
        category_id: id,
        parent_id:
          formValues.parent_category === categoryDetailInfo?.parent_id
            ? undefined
            : formValues.parent_category,
        region_name:
          formValues.edit_local_name && regionName.length > 0
            ? regionName
            : undefined,
        desc:
          formValues?.description === categoryDetailInfo?.description
            ? undefined
            : formValues?.description,
      };
      try {
        setIsSubmitLoading(true);
        const { code, message } = await categoryRuleAPIClient.UpdateCategory(
          updateCategoryRequest,
        );
        if (code === 0) {
          onVisibleChange();
        } else {
          Message.error(message);
        }
      } catch (error) {
        const { message } = error;
        Message.error(message);
      } finally {
        setIsSubmitLoading(false);
      }
    } else {
      const createCategoryRequest: CreateCategoryRequest = {
        category_name: formValues.category_name,
        parent_id: formValues.parent_category || '0',
        is_leaf: formValues.leaf_category,
        desc: formValues?.description,
        local_names: formValues.edit_local_name
          ? regionList
              .filter(item => item.region !== 'UNIVERSAL')
              .map(item => {
                return {
                  region: item.region,
                  local_name: formValues[`local_name_${item.region}`],
                };
              })
          : undefined,
      };

      try {
        setIsSubmitLoading(true);
        const {
          code,
          data,
          message,
        } = await categoryRuleAPIClient.CreateCategory(createCategoryRequest);
        if (code === 0) {
          Message.success('Category created successfully');
          onVisibleChange();
        } else {
          Message.error(message);
        }
      } catch (error) {
        const { message } = error;
        Message.error(message);
      } finally {
        setIsSubmitLoading(false);
      }
    }
  };

  const handleCancel = () => {
    onVisibleChange();
  };

  return (
    <>
      <Modal
        visible={visible}
        title={id ? 'Edit Category' : 'New Category'}
        style={{ width: 800 }}
        onCancel={handleCancel}
        footer={
          <>
            <Button type="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: 12 }}
              loading={isSubmitLoading}
              onClick={handleClick}>
              Save
            </Button>
          </>
        }>
        <ModalContainer>
          <EasyForm
            formRef={formRef}
            customOptions={{ layout: 'horizontal' }}
            buttonList={[]}
            options={
              isEditLocalName
                ? [
                    ...easyFormOption.slice(0, 2),
                    ...localNameOptions,
                    ...easyFormOption.slice(2),
                  ]
                : easyFormOption
            }
          />
        </ModalContainer>
      </Modal>
    </>
  );
};

export default NewCategoryModal;
