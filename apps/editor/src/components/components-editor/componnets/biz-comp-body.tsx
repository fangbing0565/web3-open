import React, {
    FC,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from 'react';
  import { useDebounceFn } from '@byted/hooks';
  import Sortable from 'sortablejs';
  import { Button, Message } from '@arco-design/web-react';
  import { useHistory } from '@jupiter/plugin-runtime/router';
  import { PAGE_PATH_LIST } from '@/constants/page-components';
  import cs from 'classnames';
  import styles from '../index.scss';
  import { createClickButton, onWindowClick } from '../utils/create-click-button';
  import { CLASS_NAMES } from '../constants/class-name';
  import CdnGenForm from '../utils/factory-gen-form';
  import { SCHEMA_ACTION } from '../utils/set-schema-json';
  import { EDITOR_TYPE } from '..';
  import { BIZ_PATH_LIST } from '../../../constants/biz-components';
  import { initBizComponentDefaultSchema } from '../utils/get-default-component-props';
  import { MAGIC_ITEM_TYPE } from '../utils/all-components-name';
  import { EditorIPage } from '../utils/type';
  import { schemaContext } from './schema-provider';
  
  let $bizBodySectionList: any;
  let $bizBodyFiledList: any[] = [];
  let beforeRemoveCopyItem: HTMLElement;
  let retryTout: any;
  
  type BizCompBodyType = {
    saveJsonApi: (val: EditorIPage) => Promise<any>;
  };
  
  let saveFn: any;
  
  const BizCompBody: FC<PropsWithChildren<BizCompBodyType>> = ({
    saveJsonApi,
  }) => {
    const history = useHistory();
    const {
      setSchemaJson,
      pageJson,
      setCurrentTargetId,
      setHoverTargetId,
      driveRecord,
      resetPageJson,
      currentRecordUuid,
      pageJsonRecordList,
      editorType,
      bizComponents,
      bizType,
    } = useContext(schemaContext);
    const [editTime, setEditTime] = useState(0);
    const [loading, setLoading] = useState(false);
    const bizBodyRef = useRef<HTMLDivElement>(null);
  
    const isFirstRecord = useMemo(
      () => pageJsonRecordList?.[0]?.uuid === currentRecordUuid,
      [pageJsonRecordList, currentRecordUuid],
    );
  
    const isLastRecord = useMemo(
      () => pageJsonRecordList?.slice(-1)?.[0]?.uuid === currentRecordUuid,
      [pageJsonRecordList, currentRecordUuid],
    );
  
    const onAddSectionSortable = useCallback(
      (evt: any) => {
        const { newIndex, to, item } = evt;
        console.log({ newIndex, to, item });
        const { bizKey, bizType } = item?.dataset;
        setSchemaJson({
          type: SCHEMA_ACTION.ADD_SECTION,
          payload: {
            data: {
              newSectionIndex: newIndex,
              bizType,
              bizKey,
            },
          },
        });
        if (to?.hasChildNodes?.(item)) {
          to?.removeChild?.(item);
        }
      },
      [pageJson],
    );
  
    const onChangeSectionSortable = useCallback(
      evt => {
        const { oldIndex, newIndex } = evt;
        setSchemaJson({
          type: SCHEMA_ACTION.EXCHANGE_SECTION,
          payload: {
            data: {
              oldSectionIndex: oldIndex,
              newSectionIndex: newIndex,
            },
          },
        });
      },
      [pageJson],
    );
  
    const onAddFieldSortable = useCallback(
      evt => {
        const { from, to, newIndex, item } = evt;
        const fromIndex = from?.dataset?.bizSectionIndex;
        if (fromIndex === undefined || fromIndex === '' || fromIndex === null) {
          const toIndex = to?.dataset?.bizSectionIndex;
          const componnetType = item?.dataset?.bizType;
          if (componnetType === 'custom' || componnetType === 'magic') {
            const componentField = item?.dataset?.bizField;
            setSchemaJson({
              type: SCHEMA_ACTION.ADD_CUSTOM_FIELD,
              payload: {
                data: {
                  toSectionIndex: toIndex,
                  toFieldIndex: newIndex,
                  fieldId: componentField,
                  componnetType,
                },
              },
            });
          } else {
            const componentKey = item?.dataset?.bizKey;
            setSchemaJson({
              type: SCHEMA_ACTION.ADD_FIELD,
              payload: {
                data: {
                  toSectionIndex: toIndex,
                  toFieldIndex: newIndex,
                  componentKey,
                },
              },
            });
          }
          if (to?.hasChildNodes?.(item)) {
            to?.removeChild?.(item);
          }
        }
      },
      [pageJson, bizComponents, bizType],
    );
  
    const onStartFieldSortable = useCallback(evt => {
      // 勿删 缓存节点
      // 此处为了保证 sortable 删除了节点，但是 react ast 未删除节点导致的 remove 找不到 child bug！
      beforeRemoveCopyItem = evt.item;
    }, []);
  
    const onChangeFieldSortable = React.useCallback(
      evt => {
        const { from, to, oldIndex, newIndex, item } = evt;
        const fromIndex = from?.dataset?.bizSectionIndex;
        const toIndex = to?.dataset?.bizSectionIndex;
  
        if (fromIndex !== toIndex) {
          if (to?.hasChildNodes?.(item)) {
            to?.removeChild?.(item);
          }
  
          // 勿删 添加节点
          // 此处为了保证 sortable 删除了节点，但是 react ast 未删除节点导致的 remove 找不到 child bug！
          if (beforeRemoveCopyItem) {
            from.appendChild(beforeRemoveCopyItem);
          }
        }
        setSchemaJson({
          type: SCHEMA_ACTION.EXCHANGE_FIELD,
          payload: {
            data: {
              oldSectionIndex: fromIndex,
              newSectionIndex: toIndex,
              oldFieldIndex: oldIndex,
              newFieldIndex: newIndex,
            },
          },
        });
      },
      [pageJson],
    );
  
    const setSortable = useDebounceFn(bizBodyRef => {
      const $bodyDom = bizBodyRef.current;
      const $bodySection = $bodyDom.querySelector(
        `.${CLASS_NAMES.BIZ_BODY_WARPPER} .${CLASS_NAMES.BIZ_BODY_SECTION}`,
      );
      if (!$bodySection) {
        // prevent body dom does not render
        setTimeout(() => {
          setSortable(bizBodyRef);
        }, 100);
        return;
      }
      if (!$bodySection?.children) {
        return;
      }
      onWindowClick({
        setCurrentTargetId,
      });
      let index = 0;
      for (const $bodySectionItem of $bodySection.children) {
        $bodySectionItem.appendChild(
          createClickButton({
            currentTarget: $bodySectionItem,
            setSchemaJson,
            setCurrentTargetId,
            setHoverTargetId,
            editorType,
            fieldType: 'section',
            sectionIndex: index++,
          }),
        );
      }
      $bizBodySectionList?.destroy?.();
      $bizBodySectionList = Sortable.create($bodySection, {
        animation: 150,
        group: {
          name: 'section',
        },
        sort: editorType === EDITOR_TYPE.BIZ_PAGE,
        delay: editorType === EDITOR_TYPE.BIZ_PAGE ? 0 : 999999,
        onAdd: onAddSectionSortable,
        onEnd: onChangeSectionSortable,
      });
  
      $bizBodyFiledList.forEach($fieldItem => {
        $fieldItem?.destroy?.();
      });
      $bizBodyFiledList = [];
  
      const $fieldItemsWarpper = $bodySection.querySelectorAll(
        `.${CLASS_NAMES.BIZ_BODY_FILEDS}`,
      );
      index = 0;
      for (const $fieldItemWarpper of $fieldItemsWarpper) {
        const $fieldItems = $fieldItemWarpper.children;
        for (const $fieldItem of $fieldItems) {
          $fieldItem.appendChild(
            createClickButton({
              currentTarget: $fieldItem,
              setSchemaJson,
              setCurrentTargetId,
              setHoverTargetId,
              editorType,
              fieldType: 'field',
            }),
          );
        }
        if (editorType === EDITOR_TYPE.BIZ_PAGE || index++ === 0) {
          const bizBodyFiledsortableItem = Sortable.create($fieldItemWarpper, {
            animation: 150,
            filter: '.bizSectionTitle',
            group: {
              name: 'field',
            },
            sort: editorType === EDITOR_TYPE.BIZ_PAGE,
            delay: editorType === EDITOR_TYPE.BIZ_PAGE ? 0 : 999999,
            onStart: onStartFieldSortable,
            onAdd: onAddFieldSortable,
            onEnd: onChangeFieldSortable,
          });
          $bizBodyFiledList.push(bizBodyFiledsortableItem);
        }
      }
    }, 100).run;
  
    useEffect(() => {
      setSortable(bizBodyRef);
    }, [pageJson, bizBodyRef, bizComponents]);
  
    useEffect(() => {
      if (editTime >= 10) {
        handlerSaveJson({
          saveType: 'auto',
        });
      }
    }, [editTime]);
  
    useEffect(() => {
      if (editTime >= 10) {
        setEditTime(0);
      } else {
        setEditTime(editTime + 1);
      }
    }, [pageJson]);
  
    // Save short cut key
    useEffect(() => {
      document.removeEventListener('keydown', saveFn);
      saveFn = (evt: KeyboardEvent) => {
        if (
          (evt.ctrlKey || evt.metaKey) &&
          evt.key.toLocaleLowerCase() === 's' &&
          !evt.shiftKey
        ) {
          handlerSaveJson();
          evt.preventDefault();
        }
      };
      document.addEventListener('keydown', saveFn);
    }, [pageJson, saveJsonApi]);
  
    const handlerSaveJson = useCallback(
      (e = {}, retryTime = 0) => {
        const { saveType } = e;
        setEditTime(0);
        clearTimeout(retryTout);
        if (pageJson) {
          setLoading(true);
          saveJsonApi(pageJson)
            .then(({ page_id, biz_component_group_id }) => {
              console.log({ page_id, biz_component_group_id });
              Message.success(
                saveType === 'auto' ? 'Auto save success!' : 'Save success!',
              );
              if (page_id) {
                history.replace(PAGE_PATH_LIST.pageComponentEditPath + page_id);
              } else if (biz_component_group_id) {
                history.replace(
                  BIZ_PATH_LIST.bizComponentEditPath + biz_component_group_id,
                );
              }
            })
            .catch(() => {
              const txt = retryTime < 3 ? '3s try it again.' : '';
              Message.error(
                saveType === 'auto'
                  ? `Auto save failed!${txt}`
                  : `save failed!${txt}`,
              );
  
              retryTout = setTimeout(() => {
                if (retryTime < 2) {
                  handlerSaveJson(e, retryTime + 1);
                }
              }, 3000);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      },
      [pageJson, saveJsonApi],
    );
  
    return (
      <div
        className={cs({
          [styles.bizBodyWrapper]: true,
          [CLASS_NAMES.BIZ_BODY_WARPPER]: true,
        })}>
        <div
          className={styles.footer}
          onClick={e => {
            e.stopPropagation();
          }}>
          <div className={styles.topBox}>
            <Button className={styles.rightButton} disabled={true}>
              Back
            </Button>
            <Button
              className={styles.rightButton}
              disabled={isFirstRecord}
              onClick={() => driveRecord(-1)}>
              Undo
            </Button>
            <Button
              className={styles.rightButton}
              disabled={isLastRecord}
              onClick={() => driveRecord(1)}>
              Redo
            </Button>
            <Button
              className={styles.rightButton}
              disabled={isFirstRecord}
              onClick={() => resetPageJson()}>
              Reset
            </Button>
            {/* <Button onClick={handleChangeMode}>Playground</Button> */}
          </div>
          <Button loading={loading} type="primary" onClick={handlerSaveJson}>
            Save
          </Button>
        </div>
        <div
          className={cs({
            [styles.bizBody]: true,
            [CLASS_NAMES.BIZ_BODY_SCROLL]: true,
          })}
          ref={bizBodyRef}>
          {pageJson ? (
            <CdnGenForm
              showSubmit={editorType === EDITOR_TYPE.BIZ_PAGE}
              pageJson={pageJson}
              submitFetcher={async (values: Record<string, any>) => {
                return values;
              }}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };
  
  export default BizCompBody;
  