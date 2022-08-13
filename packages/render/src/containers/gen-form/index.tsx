import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from 'react';
  import { omit } from 'lodash-es';
  import { useRequest } from '@byted/hooks';
  import {
    FORM_ITEM_TYPE,
    SchemaFormOption,
  } from '@m4b-design/pearl-schema-form';
  import ProForm from '@m4b-design/pearl-pro-form';
  import Body, { SectionProps } from './componnets/body';
  import Footer from './componnets/footer';
  import Header from './componnets/header';
  import {
    FormValue,
    FormValueType,
    GenFormProps,
    IField,
    IFormPage,
    IRulesProps,
  } from './type';
  import { ISection } from './type';
  import { RulesProps } from '@arco-design/web-react';
  import Starling from '@ies/starling_client';
  
  const formValueTypeMap: Record<string, FormValueType> = {
    SELECT: FormValueType.SELECT,
  };
  
  const GenForm = (props: PropsWithChildren<GenFormProps>) => {
    const {
      showSubmit,
      json,
      optionsMap,
      componentsMap,
      submitFetcher,
      currStep,
      form,
      formValues,
      onValuesChange,
      globalProps,
      ...others
    } = props;
    const { content, page_options } = json;
    const {
      i18nKey,
      nameSpace,
      locale = 'en',
      zoneHost = 'https://starling-oversea.byteoversea.com',
      fallbackLang = ['en', 'id-ID'],
      test = true,
    } = (page_options ? JSON.parse(page_options) : {}) as any;
    const [defaultFormRef] = ProForm.useForm();
    const formRef = form ?? defaultFormRef;
  
    const [i18nData, setI18nData] = useState<Record<string, any>>({});
  
    const loadI18n = () => {
      // /^\$\.(.*)/
      if (i18nKey && nameSpace) {
        const starling = new Starling({
          apiKey: i18nKey, // 项目对应apiKey，在平台上查看，更多实例化参数见下方
          namespace: [nameSpace], // 要拉取的文案空间，更多实例化参数见下方，
          locale, // starling平台上的语言码，
          zoneHost, // 文案获取接口域名，v3 新增
          // TEAChannelDomain: 'https://mcs.zijieapi.com', // sdk 内部 tea 数据打点域名，v3 新增
          test,
          fallbackLang,
          store: {get:()=>{}, set: ()=>{}}
        });
        starling.load().then((res: any) => {
          console.log('load',res)
          setI18nData(res);
        });
      } else {
        setI18nData({});
      }
    };
  
    useEffect(() => {
      loadI18n();
    }, []);
  
    const i18nPage = useMemo(() => {
      const reg = /^\$\.(.*)/;
      const isI18nKey = (val: string) => reg.test(val);
      const replaceVal = (val: unknown): unknown => {
        if (typeof val === 'string') {
          return isI18nKey(val) ? i18nData[val.replace(/^\$\./, '')] : val;
        }
  
        if (val instanceof Array) {
          return val.map(child => replaceVal(child));
        }
        if (val instanceof Object) {
          return Object.keys(val).reduce(
            (result: Record<string, unknown>, key: string) => {
              const item = (val as Record<string, unknown>)[key];
              result[key] = replaceVal(item);
              return result;
            },
            {},
          );
        }
        return val;
      };
      return replaceVal(content);
    }, [i18nData, content]);
  
    const { header, footer, body } = i18nPage as IFormPage;
    const { editorMode, onReset, ...otherBodyProps } = body;
  
    const { run: submitData } = useRequest(
      async props => {
        try {
          if (submitFetcher) {
            const result = await submitFetcher(props);
            return result;
          }
          return {};
        } catch (error) {
          return { error: true, message: error };
        }
      },
      {
        auto: false,
      },
    );
    //  json to config
  
    // Merge sections And componentsMap And optionsMap
    // 根据表单字段，映射自定义组件 componentsMap，替换再渲染
    // 带有动态数据依赖的组件，通过 optionsMap，传递动态数据，建议数据ready 再渲染，减少渲染次数
    const genSectionsFields = (
      sections: ISection[],
      componentsMap?: Record<string, any>,
    ) => {
      return sections
        .map((section: ISection) => ({
          ...section,
          children: section?.children?.reduce(
            (result: SchemaFormOption[], originalItem: IField) => {
              const item = omit(originalItem, 'bizType');
              const key = Object.keys(FORM_ITEM_TYPE).find(
                key => (FORM_ITEM_TYPE as any)[key] === item.type,
              );
              const type =
                componentsMap?.[item.field] ||
                (key && (FORM_ITEM_TYPE as any)[key]) ||
                item.type;
              if (type) {
                const customProps = optionsMap?.[item.field]
                  ? {
                      ...item.customProps,
                      options: optionsMap[item.field],
                    }
                  : item.customProps;
                // TODO 认真比对
                const newItem: SchemaFormOption = omit(
                  item,
                  'customProps',
                  'visible',
                  'disbaled',
                  'effect',
                  'rules',
                ) as SchemaFormOption;
                newItem.customProps = customProps;
                newItem.type = type;
                if (editorMode === 'view') {
                  if (typeof item.visible === 'string') {
                    newItem.visible = eval(item.visible) as () => boolean;
                  }
                }
                if (
                  editorMode !== 'disabled' &&
                  typeof item?.disabled === 'string'
                ) {
                  newItem.disabled = eval(item.disabled) as () => boolean;
                }
                if (editorMode === 'disabled') {
                  newItem.disabled = (({}) => true) as () => boolean;
                }
                if (typeof item.effect === 'string') {
                  newItem.effect = eval(item.effect) as () => boolean;
                }
                if (item?.rules?.length) {
                  newItem.rules = item.rules.map(
                    (rule: IRulesProps): Partial<RulesProps> => {
                      if (typeof rule?.validator === 'string') {
                        return {
                          ...rule,
                          validator: eval(rule.validator) as () => boolean,
                        };
                      }
                      return rule as RulesProps;
                    },
                  );
                }
                if (item?.field && formValues) {
                  let formValue = formValues.find(i => i.key === item.field);
                  if (formValue) {
                    if (formValue?.value) {
                      if (
                        [
                          FORM_ITEM_TYPE.DATE_RANGE_PICKER,
                          FORM_ITEM_TYPE.DATE_RANGE_PICKER_I18N,
                          FORM_ITEM_TYPE.TIME_RANGE_PICKER,
                        ].includes(newItem.type as any)
                      ) {
                        // 当组件是range类date picker，需要把string装换成数组
                        try {
                          newItem.initialValue = JSON.parse(formValue?.value);
                        } catch (error) {
                          newItem.initialValue = [];
                        }
                      } else {
                        newItem.initialValue = formValue.value;
                      }
                    }
                    if (formValue?.not_editable) {
                      newItem.disabled = () => true;
                    }
                  }
                }
                result.push(newItem);
              }
              return result;
            },
            [],
          ),
        }))
        .filter(section => {
          if (typeof section.visible === 'string') {
            console.log('section.visible', section.visible);
            const visible = eval(section.visible) as ({
              values,
            }: {
              values?: any;
            }) => boolean;
            if (visible({ values: formRef.getFieldsValue() })) {
              return true;
            }
            return false;
          }
          return true;
        });
    };
    const sections = genSectionsFields(body.sections, componentsMap);
  
    const handleSubmit = async (values: any) => {
      const submitValues: FormValue[] = body.sections.reduce(
        (r: FormValue[], i: ISection): FormValue[] => {
          if (!i.children) {
            return r;
          }
          return [
            ...r,
            ...i.children.reduce((re: FormValue[], it: IField) => {
              const val = values[it.field];
              if (val === null || val === undefined) {
                return re;
              }
              const originalVal = formValues?.find(i => i.key === it.field);
              return [
                ...re,
                {
                  ...originalVal,
                  key: it.field,
                  value: val,
                  type: it.type ? formValueTypeMap[it.type] : originalVal?.type, // 待确认 是type 还是 field
                },
              ];
            }, []),
          ];
        },
        [],
      );
      console.log('submitValues', submitValues);
      await submitData(submitValues);
      // 调用接口
      await props?.onSubmit?.(submitValues);
    };
    const handleReset = async (values: any) => {
      await props?.onReset?.(values);
      // 清空表单数据
    };
  
    const renderBodyProps = useMemo(() => {
      let newProps: any = otherBodyProps;
      newProps.onValuesChange = (
        value: Partial<FormData>,
        values: Partial<FormData>,
      ) => {
        if (body?.onValuesChange) {
          const { onValuesChange } = body;
          if (onValuesChange && typeof onValuesChange === 'string') {
            const formValuesChange = eval(onValuesChange) as ({}: any) => any;
            formValuesChange({ value, values, formRef });
          }
        }
        if (onValuesChange) {
          onValuesChange({ value, values, formRef });
        }
      };
      if (onReset && typeof onReset === 'string') {
        newProps.onReset = eval(onReset) as () => any;
      }
      return newProps;
    }, [body.colSpan]);
  
    return (
      <div>
        {header?.title ? <Header title={header?.title} /> : null}
        {sections ? (
          <Body
            {...others}
            {...renderBodyProps}
            form={formRef}
            showSubmit={showSubmit}
            gutter={body.gutter}
            sections={sections as SectionProps[]}
            currStep={currStep}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        ) : null}
  
        {footer?.title ? <Footer title={footer?.title} /> : null}
      </div>
    );
  };
  export default React.forwardRef(GenForm);
  