import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ProForm from '@m4b-design/pearl-pro-form';
import { IField, ISection } from '@oec-open/ttspc-render';
import { useDebounceFn } from '@byted/hooks';
import SchemaForm, { FORM_ITEM_TYPE } from '@m4b-design/pearl-schema-form';
import Section from '@m4b-design/pearl-section';
import { Message } from '@arco-design/web-react';
import { getObjKey, onSetSafeValueFn, validatorI18n } from '../utils/utils';
import { SCHEMA_ACTION } from '../utils/set-schema-json';
import styles from '../index.scss';
import {
  bizKey2Render,
  BIZ_ITEM_TYPE,
  componentDefaultProps,
  pageDefaultProps,
} from '../utils/render-component-props';
import { captureFieldRepeat } from '../utils/capture-error';
import { EDITOR_TYPE } from '..';
import { schemaContext } from './schema-provider';

const formItemKeys = Object.values(FORM_ITEM_TYPE);
const bizFormKeys = Object.values(BIZ_ITEM_TYPE);

const BizCompProp = () => {
  const {
    pageJson,
    setSchemaJson,
    currentTargetJson,
    editorType,
    allI18nKeys,
  } = React.useContext(schemaContext);
  const [memoMap, setMemoMap] = useState<Record<string, any>>({});
  const [lastRenderNodeId, setLastRenderNodeId] = useState('');

  const onUpdateField = useDebounceFn((field, val) => {
    setSchemaJson({
      type: SCHEMA_ACTION.UPDTAE_FIELD_BY_NODEID,
      payload: {
        nodeId: currentTargetJson?.current?.nodeId || '',
        data: {
          field,
          data: val,
        },
      },
    });
  }, 300).run;

  const onUpdatePage = useDebounceFn((field, val) => {
    setSchemaJson({
      type: SCHEMA_ACTION.UPDATE_PAGE_JSON,
      payload: {
        data: {
          field,
          data: val,
        },
      },
    });
  }, 300).run;

  const onChangeField = useCallback(
    (field: string, val?: string) => {
      console.log({ field, val });
      // if (field === 'customProps.validatorRules') {
      //   const validator = getValidatorText(val);
      // }
      const key = `${currentTargetJson?.current?.nodeId}-${field}`;
      if (memoMap.hasOwnProperty(key) && memoMap[key] === val) {
        return;
      }
      if (field === 'field') {
        const repeatJson = captureFieldRepeat(val, pageJson);
        if (repeatJson) {
          return;
        }
      }
      memoMap[field] = val;
      setMemoMap(memoMap);
      if (currentTargetJson?.current) {
        onUpdateField(field, val);
      } else {
        onUpdatePage(field, val);
      }
    },
    [pageJson, currentTargetJson, memoMap],
  );

  const allFields = useMemo(() => {
    const list: string[] = [];
    pageJson?.content.body.sections.forEach((section: ISection) => {
      section.children?.forEach((field: IField) => {
        list.push(field.field);
      });
    });
    return list;
  }, [pageJson]);

  const currentPropsOptions = useMemo(() => {
    if (currentTargetJson?.current) {
      const curr: any[] =
        componentDefaultProps[currentTargetJson?.current?.type];
      const isCustom = !(
        currentTargetJson?.current?.type === 'section' ||
        (currentTargetJson?.current as IField)?.bizType === 0
      );
      curr?.forEach(item => {
        item.children.forEach((i: any) => {
          i.disabled = () => isCustom && editorType === EDITOR_TYPE.BIZ_PAGE;
          if (!formItemKeys.includes(i.type) && typeof i.type === 'string') {
            if (!bizFormKeys.includes(i.type)) {
              Message.error(`${i.type} custom component is not found!`);
              return;
            }
            i.type = bizKey2Render?.[i.type]?.(
              i?.customProps,
              (currentTargetJson?.current as IField)?.field,
            );
          }
          if (i?.i18nProps?.i18nControl && allI18nKeys?.length) {
            if (!i.originType) {
              i.originType = i.type;
            }
            if (!i.originCustomProps) {
              i.originCustomProps = i.customProps;
            }
            i.type = FORM_ITEM_TYPE.SELECT;
            if (!i.customProps) {
              i.customProps = {};
            }
            i.customProps.showSearch = true;
            i.customProps.allowCreate = true;
            i.customProps.options = allI18nKeys;
          } else {
            i.customProps = i.originCustomProps || i.customProps;
            i.type = i.originType || i.type;
          }
          for (const key in i.customProps) {
            if (key === 'optionsType') {
              if (i.customProps[key] === 'allFields') {
                if (currentTargetJson.current?.type !== 'section') {
                  i.customProps.options = allFields.filter(
                    i => i !== (currentTargetJson.current as IField)?.field,
                  );
                } else {
                  i.customProps.options = allFields;
                }
              }
            }
          }
        });
      });
      return curr || [];
    } else {
      return pageDefaultProps;
    }
  }, [currentTargetJson, allFields, editorType, pageJson, allI18nKeys]);

  useEffect(() => {
    if (lastRenderNodeId === currentTargetJson?.current?.nodeId) {
      return;
    }
    setLastRenderNodeId(currentTargetJson?.current?.nodeId || '');
    if (currentPropsOptions?.length) {
      currentPropsOptions.forEach(option => {
        const obj: any = {};
        option.children?.forEach((field: IField) => {
          const json: any = currentTargetJson?.current || pageJson;
          const id = field.field;
          let data = getObjKey(json, id);
          if (/^\(\{values\}\)=>!*values\.(.*)$/.test(data)) {
            data = RegExp.$1;
          }
          obj[id] = data || undefined;
        });
        if (option.formRef) {
          option.formRef.setFieldsValue(obj);
        }
      });
    }
  }, [currentPropsOptions, currentTargetJson, lastRenderNodeId, pageJson]);

  return (
    <div
      className={styles.bizProps}
      key={currentTargetJson?.current?.nodeId}
      onClick={e => {
        e.stopPropagation();
      }}>
      {currentPropsOptions.map(option => (
        <Section
          title={option.title}
          className={styles.setionItem}
          key={option.title}>
          <SchemaFormItem
            onChange={(vals: any) => {
              for (const key in vals) {
                const findItem = option.children.find(
                  (i: any) => i.field === key,
                );
                console.log({ findItem, key, vals });
                if (findItem) {
                  if (findItem?.customProps?.setValue?.value) {
                    if (vals[key]) {
                      const val = onSetSafeValueFn(
                        findItem.customProps.setValue?.value.replace(
                          '__value__',
                          findItem.customProps.setValue?.field || vals[key],
                        ),
                      );
                      if (!val) {
                        return;
                      }
                      onChangeField(key, val);
                    } else {
                      onChangeField(key, undefined);
                    }
                  } else {
                    if (
                      !validatorI18n(Boolean(allI18nKeys?.length), vals[key])
                    ) {
                      return;
                    }
                    onChangeField(key, vals[key]);
                  }
                }
              }
            }}
            options={option.children}
            colSpan={option.colSpan}
            buttonProps={{ hideSearch: true }}
            setFormRef={(form: any) => {
              option.formRef = form;
            }}
          />
        </Section>
      ))}
    </div>
  );
};

export default BizCompProp;

const SchemaFormItem = ({
  onChange,
  options,
  colSpan,
  buttonProps,
  setFormRef,
}: any) => {
  const [formRef] = ProForm.useForm();
  useEffect(() => {
    setFormRef(formRef);
  }, []);
  return (
    <SchemaForm
      onChange={onChange}
      options={options}
      colSpan={colSpan}
      buttonProps={buttonProps}
      form={formRef}
    />
  );
};
