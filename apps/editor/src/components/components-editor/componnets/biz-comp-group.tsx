import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useDebounceFn } from '@byted/hooks';
import Sortable from 'sortablejs';
import { FORM_ITEM_TYPE } from '@m4b-design/pearl-schema-form';
import cs from 'classnames';
import { IField, ISection } from '@oec-open/ttspc-render';
import {
  groupStaticComponentRenderItem,
  magicStaticComponentRenderItem,
  RenderCustomComponent,
} from '../utils/render-default-component';
import {
  allComponentNames,
  allMagicComponentNames,
} from '../utils/all-components-name';
import styles from '../index.scss';
import { CLASS_NAMES } from '../constants/class-name';
import { EDITOR_TYPE } from '..';
import { schemaContext } from './schema-provider';

let bizGroupSectionSortable: any;
let bizGroupFieldSortable: any;
let bizCustomFieldSortable: any;
let magicFieldSortable: any;

const BizCompGroup: React.FC = () => {
  const groupSectionRef = React.useRef<HTMLDivElement>(null);
  const groupFieldRef = React.useRef<HTMLDivElement>(null);
  const customFieldRef = React.useRef<HTMLDivElement>(null);
  const magicSectionRef = React.useRef<HTMLDivElement>(null);
  const { editorType, bizComponents, pageJson } = useContext(schemaContext);

  useEffect(() => {
    console.log({ bizComponents });
  }, [bizComponents]);

  const normalList = useMemo(
    () => bizComponents?.normalSection?.children || [],
    [bizComponents],
  );
  const magicList = useMemo(() => bizComponents?.magicSections || [], [
    bizComponents,
  ]);

  const setGroupSort = useDebounceFn(groupSectionRef => {
    const $groupSection = groupSectionRef.current;
    bizGroupSectionSortable?.destroy?.();
    bizGroupSectionSortable = Sortable.create($groupSection, {
      sort: false,
      animation: 150,
      group: {
        name: 'section',
        pull: 'clone',
        put: false,
      },
    });
  }, 100).run;

  const setFiledSort = useDebounceFn(groupFieldRef => {
    const $groupField = groupFieldRef.current;
    bizGroupFieldSortable?.destroy?.();
    bizGroupFieldSortable = Sortable.create($groupField, {
      sort: false,
      animation: 150,
      group: {
        name: 'field',
        pull: 'clone',
        put: false,
      },
    });
  }, 100).run;

  const setMagicSort = useDebounceFn(magicSectionRef => {
    const $magicFields = magicSectionRef.current;
    magicFieldSortable?.destroy?.();
    magicFieldSortable = Sortable.create($magicFields, {
      sort: false,
      animation: 150,
      group: {
        name: 'section',
        pull: 'clone',
        put: false,
      },
    });
  }, 100).run;

  const setCustomFiledSort = useDebounceFn(
    (customFieldRef, normalList, usedCustomFieldIdList) => {
      if (normalList.length) {
        const $customField = customFieldRef.current;
        for (const child of $customField.children) {
          child.classList.remove(CLASS_NAMES.BIZ_COMPONENT_CANNOT_DRAG);
          const { bizField } = child.dataset;
          if (usedCustomFieldIdList.includes(bizField)) {
            child.classList.add(CLASS_NAMES.BIZ_COMPONENT_CANNOT_DRAG);
          }
        }
        bizCustomFieldSortable?.destroy?.();
        bizCustomFieldSortable = Sortable.create($customField, {
          sort: false,
          animation: 150,
          filter: `.${CLASS_NAMES.BIZ_COMPONENT_CANNOT_DRAG}`,
          group: {
            name: 'field',
            pull: 'clone',
            put: false,
          },
        });
      }
    },
    100,
  ).run;

  const usedCustomFieldIdList = useMemo(() => {
    const list: string[] = [];
    const fieldList = normalList.map(item => item.field);
    const magicFildList = magicList.map(magic => magic.children[0].field);
    const allList = [...fieldList, ...magicFildList];
    pageJson?.content.body.sections.forEach(section => {
      section.children.forEach((field: IField) => {
        if (field.bizType !== 0) {
          list.push(field.field);
        }
        if (allList.includes(field.field)) {
          list.push(field.field);
        }
      });
    });
    return list;
  }, [pageJson, normalList, magicList]);

  useEffect(() => {
    setCustomFiledSort(customFieldRef, normalList, usedCustomFieldIdList);
  }, [customFieldRef, normalList, pageJson, usedCustomFieldIdList]);

  useEffect(() => {
    setGroupSort(groupSectionRef);
  }, [groupSectionRef]);

  useEffect(() => {
    setFiledSort(groupFieldRef);
  }, [groupFieldRef]);

  useEffect(() => {
    setMagicSort(magicSectionRef);
  }, [magicSectionRef]);

  const isPageMode = useMemo(() => editorType === EDITOR_TYPE.BIZ_PAGE, [
    editorType,
  ]);

  const onClickCustomComponent = useCallback(
    (component: IField | ISection) => {
      if (usedCustomFieldIdList.includes(component.nodeId)) {
        // removeToNodeId();
        const target = component?.nodeId
          ? document.querySelector(
              `.${CLASS_NAMES.BIZ_BODY_WARPPER} [data-node-id="${component.nodeId}"]`,
            )
          : null;
        const scrollWrapper = document.querySelector(
          `.${CLASS_NAMES.BIZ_BODY_SCROLL}`,
        );
        const scrollTop = scrollWrapper?.getBoundingClientRect().top || 0;
        const targetTop = target?.getBoundingClientRect().top || 0;
        const curScrollTop = scrollWrapper?.scrollTop || 0;
        scrollWrapper?.scrollTo({
          behavior: 'smooth',
          top: targetTop + curScrollTop - scrollTop,
        });
      }
    },
    [usedCustomFieldIdList],
  );

  return (
    <div
      className={styles.bizCompGroup}
      onClick={e => {
        e.stopPropagation();
      }}>
      {isPageMode && (
        <>
          <div className={styles.groupTitle}>Biz Component List</div>
          <div className={CLASS_NAMES.BIZ_GROUP_COMP} ref={customFieldRef}>
            {normalList.map(component => (
              <div
                key={component.field}
                className={cs({
                  [styles.componentCard]: true,
                  [CLASS_NAMES.BIZ_COMPONENT_CARD]: true,
                })}
                onClick={() => {
                  onClickCustomComponent(component);
                }}
                data-biz-type="custom"
                data-biz-field={component.field}>
                <div
                  className={cs({
                    [styles.componentPreView]: true,
                    [CLASS_NAMES.BIZ_COMPONENT_PREVIEW]: true,
                  })}>
                  <RenderCustomComponent component={component} />
                </div>
                <div className={styles.componentTitle}>{component.field}</div>
              </div>
            ))}
            {magicList.map(section => (
              <div
                key={section.nodeId}
                className={cs({
                  [styles.componentCard]: true,
                  [CLASS_NAMES.BIZ_COMPONENT_CARD]: true,
                })}
                onClick={() => {
                  onClickCustomComponent(section);
                }}
                data-biz-type="magic"
                data-biz-field={section.children[0].field}>
                <div
                  className={cs({
                    [styles.componentPreView]: true,
                    [CLASS_NAMES.BIZ_COMPONENT_PREVIEW]: true,
                  })}>
                  <RenderCustomComponent component={section} />
                </div>
                <div className={styles.componentTitle}>{section.title}</div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className={styles.groupTitle}>Basic Component List</div>
      {isPageMode && (
        <div className={CLASS_NAMES.BIZ_GROUP_SECTION} ref={groupSectionRef}>
          <div className={styles.componentCard} data-biz-type="common">
            <div
              className={cs({
                [styles.componentPreView]: true,
                [CLASS_NAMES.BIZ_COMPONENT_PREVIEW]: true,
              })}>
              {groupStaticComponentRenderItem[FORM_ITEM_TYPE.SECTION]}
            </div>
            <div className={styles.componentTitle}>section</div>
          </div>
        </div>
      )}
      <div className={CLASS_NAMES.BIZ_GROUP_COMP} ref={groupFieldRef}>
        {allComponentNames.map(componentKey => (
          <div
            key={componentKey}
            className={cs({
              [styles.componentCard]: true,
              [CLASS_NAMES.BIZ_COMPONENT_CARD]: true,
            })}
            data-biz-type="common"
            data-biz-key={componentKey}>
            <div
              className={cs({
                [styles.componentPreView]: true,
                [CLASS_NAMES.BIZ_COMPONENT_PREVIEW]: true,
              })}>
              {groupStaticComponentRenderItem[componentKey]}
            </div>
            <div className={styles.componentTitle}>{componentKey}</div>
          </div>
        ))}
      </div>
      {!isPageMode && (
        <div className={CLASS_NAMES.BIZ_GROUP_COMP} ref={magicSectionRef}>
          <div className={styles.groupTitle}>Magic Component List</div>
          {allMagicComponentNames.map(magicKey => (
            <div
              key={magicKey}
              className={cs({
                [styles.componentCard]: true,
              })}
              data-biz-type="magic"
              data-biz-key={magicKey}>
              <div
                className={cs({
                  [styles.componentPreView]: true,
                  [CLASS_NAMES.BIZ_COMPONENT_PREVIEW]: true,
                })}>
                {magicStaticComponentRenderItem[magicKey]}
              </div>
              <div className={styles.componentTitle}>{magicKey}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BizCompGroup;
