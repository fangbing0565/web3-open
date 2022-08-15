import React, { FC, PropsWithChildren, Ref, useMemo } from 'react';
import { ActionApply } from '@i18n-ecom-op/containers';

const withRef = (
  Component: FC<PropsWithChildren<Record<string, any>>>,
  ChildRef: Ref<React.Component>,
) => {
  return (props: PropsWithChildren<Record<string, any>>) => {
    return <Component ref={ChildRef} {...props} />;
  };
};

/**
 * @title ActionApplyImpl
 * @description ActionApplyImpl组件，用于给需要权限才能访问并且带有disable属性的组件增加权限申请功能
 */
const ActionApplyImpl: FC<
  | PropsWithChildren<{
      component: FC<PropsWithChildren<Record<string, any>>>;
      resourceKey: string;
    }>
  | Record<string, any>
> = props => {
  const { component, resourceKey, children, ...restProps } = props;
  return (
    <ActionApply
      component={component}
      resourceKey={resourceKey}
      componentProps={restProps}>
      {children}
    </ActionApply>
  );
};

/**
 * @title ActionApplyImplWithRef
 * @description 带ref的ActionApplyImpl组件，用于需要传递ref给内部的component的情况
 */
const ActionApplyImplWithRef: FC<
  | PropsWithChildren<{
      component: FC<PropsWithChildren<Record<string, any>>>;
      resourceKey: string;
      childRef: Ref<React.Component>;
    }>
  | Record<string, any>
> = props => {
  const { component, resourceKey, childRef, children, ...restProps } = props;
  const componentWithRef = useMemo(() => withRef(component, childRef), [
    childRef,
    component,
  ]);
  return (
    <ActionApply
      component={componentWithRef}
      resourceKey={resourceKey}
      componentProps={restProps}>
      {children}
    </ActionApply>
  );
};

export { ActionApplyImpl, ActionApplyImplWithRef };
