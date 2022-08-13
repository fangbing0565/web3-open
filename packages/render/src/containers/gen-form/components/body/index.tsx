import React from 'react';
import { CSSProperties, ReactNode } from 'react';
import { omit } from 'lodash-es';
import { GridRowGutter } from '@arco-design/web-react/es/Grid/interface';
import { FormInstance } from '@arco-design/web-react';
import SchemaForm, {
  SchemaFormOption,
  FormButtonProps,
} from '@m4b-design/pearl-schema-form';
import Section from '@m4b-design/pearl-section';
import './index.css';
// import { Section } from '@m4b-design/components';

export interface SectionProps {
  /**
   * @zh section id
   * @en id
   *  */
  nodeId: string;
  title: ReactNode;
  /**
   * @zh 当前步骤
   * @en step
   *  */
  step?: number | string;
  children: SchemaFormOption[];
}
export declare type KeyType = string | number | symbol;
export interface BodyProps<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends KeyType = keyof FormData,
> {
  /**
   * @zh 是否展示提交
   * @en showSubmit
   *  */
  showSubmit?: boolean;
  /**
   * @zh section Layout spacing between
   * @en gutter
   *  */
  gutter?: GridRowGutter | Array<GridRowGutter>;
  /**
   * @zh section Style
   * @en sectionStyle
   *  */
  sectionStyle?: CSSProperties;
  /**
   * @zh A collection of multiple sets of forms
   * @en sections
   *  */
  sections?: SectionProps[];
  /**
   * @zh Form submission event
   * @en onSubmit
   *  */
  onSubmit?: (values: FormData) => Promise<any>;
  /**
   * @zh Form reset event
   * @en onReset
   *  */
  onReset?: (values: Record<string, any>) => Promise<any>;
  /**
   * @zh Button related Props
   * @en buttonProps
   */
  buttonProps?: FormButtonProps;
  /**
   * @zh 当前步骤
   * @en currStep
   *  */
  currStep?: number | string;
  /**
   * @zh form
   * @en form
   */
  form?: FormInstance<FormData, FieldValue, FieldKey>;
}
const Body = (props: BodyProps) => {
  const {
    showSubmit,
    currStep,
    gutter,
    sectionStyle,
    sections,
    onSubmit,
    onReset,
    buttonProps,
    form,
    ...otherProps
  } = props;
  // Submit button，Support incoming，Otherwise go by default
  return (
    <div className={`sections __biz_body_section`}>
      {sections?.map(
        ({ nodeId, step, title, children, ...otherProps }, index: number) =>{
          return  (
            <div
            className={`section_item __biz_section_item`}
            id={`__biz_${nodeId}`}
            data-node-id={nodeId}
            key={nodeId}
            style={{
              ...(step && step !== currStep
                ? { ...sectionStyle, display: 'none' }
                : sectionStyle),
              ...(gutter !== undefined) ? {
                margin: (gutter instanceof Array ? gutter.map(i=>(`${i}px`)).join(',') : `${gutter}px`),
              } : {}
            }}
            >
              <Section
              title={title}
              >
              <SchemaForm
                {...otherProps}
                form={form}
                formRowClassName="__biz_body_fields"
                dataBizSectionIndex={String(index)}
                options={children}
                buttonProps={{
                  hideSearch: true,
                }}
              />
            </Section>
            </div>
          );
        },
      )}
        <div
        className={`section_item __biz_section_item`}
        style={{
          ...(gutter !== undefined) ? {
            margin: (gutter instanceof Array ? gutter.map(i=>(`${i}px`)).join(',') : `${gutter}px`),
          } : {},
          ...showSubmit ? {} : {display: 'none'}
        }}
        >
          <Section>
            <SchemaForm
              {...otherProps}
              form={form}
              buttonProps={buttonProps}
              onReset={onReset}
              onSubmit={onSubmit}
            />
          </Section>
        </div>
    </div>
  );
};
export default Body;
