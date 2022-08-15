import { FORM_ITEM_TYPE } from '@m4b-design/pearl-schema-form';
import { IField, IFormPage, ISection } from '@oec-open/ttspc-render';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import uuidv4 from '@i18n-ecom/lib/dist/commonjs/uuid';
import { pageConfigAPIClient } from '@/api/operation/serv/oec_operation_form_page_api';
import Starling from '@ies/starling_client'; // web 用户使用该模块
import { CurrentTargetJsonType, EDITOR_TYPE, I18nOptionsType } from '..';
import { CLASS_NAMES } from '../constants/class-name';
import {
  getCurrentTargetById,
  getRelationFieldIds,
} from '../utils/create-click-button';
import { SchemaActionType, setJson } from '../utils/set-schema-json';
import { EditorIPage } from '../utils/type';

export const schemaContext = React.createContext<{
  pageJson?: EditorIPage;
  schemaJson: IFormPage;
  setPageJson?: (page: EditorIPage) => void;
  setSchemaJson: (action: SchemaActionType) => void;
  setCurrentTargetId: (val?: string) => void;
  currentTargetJson: CurrentTargetJsonType;
  setHoverTargetId: (val: string) => void;
  driveRecord: (step: number) => void;
  currentRecordUuid: string;
  pageJsonRecordList: PageRecordItem[];
  resetPageJson: () => void;
  editorType: EDITOR_TYPE;
  bizComponents?: {
    normalSection: ISection;
    magicSections: ISection[];
  };
  bizType: number;
  currentRelationList: string[];
  allI18nKeys?: string[];
  t: (key: string) => string;
}>({} as any);

type SchemaProviderType = {
  defaultPageJson: EditorIPage;
  editorType: EDITOR_TYPE;
  bizType: number;
};

type PageRecordItem = {
  uuid: string;
  data: EditorIPage;
};

const genRecord = (data: EditorIPage) => ({
  uuid: uuidv4(),
  data,
});

let backRecordFn: (evt: KeyboardEvent) => void;

const SchemaProvider: FC<PropsWithChildren<SchemaProviderType>> = ({
  children,
  defaultPageJson,
  editorType,
  bizType,
}) => {
  // states
  const defaultJsonRecord = genRecord(defaultPageJson);
  const [hoverTargetId, setHoverTargetId] = useState<string>();
  const [currentTargetId, setCurrentTargetId] = useState<string>();
  const [pageJson, setPageJson] = useState<EditorIPage>(defaultPageJson);
  const [currentRecordUuid, setCurrentRecordUuid] = useState(
    defaultJsonRecord.uuid,
  );
  const [pageJsonRecordList, setPageJsonRecordList] = useState<
    PageRecordItem[]
  >([defaultJsonRecord]);
  const [bizComponents, setBizComponents] = useState<{
    normalSection: ISection;
    magicSections: ISection[];
  }>();

  // memos
  const schemaJson = useMemo(() => pageJson.content, [pageJson]);
  const currentTargetJson: CurrentTargetJsonType = useMemo(
    () => getCurrentTargetById(schemaJson, currentTargetId),
    [currentTargetId, schemaJson],
  );
  const currentRelationList: string[] = useMemo(
    () =>
      getRelationFieldIds(
        schemaJson,
        currentTargetJson?.current?.nodeId,
        (currentTargetJson?.current as IField)?.field,
      ),
    [currentTargetJson, schemaJson],
  );

  const i18nKey = useMemo(() => pageJson?.page_options?.i18n_key || '', [
    pageJson,
  ]);
  const nameSpace = useMemo(() => pageJson?.page_options?.name_space || '', [
    pageJson,
  ]);

  const [i18nRes, setI18nRes] = useState<Record<string, string>>();

  const allI18nKeys = useMemo(() => {
    console.log({ i18nRes });
    if (!i18nRes) {
      return [];
    }
    return Object.keys(i18nRes).map(k => `$.${k}`);
  }, [i18nRes]);

  const t = useCallback(
    (key: string) => {
      if (!i18nRes) {
        return key;
      }
      return i18nRes[key];
    },
    [i18nRes],
  );

  useEffect(() => {
    if (i18nKey && nameSpace) {
      const starling = new Starling({
        apiKey: i18nKey, // 项目对应apiKey，在平台上查看，更多实例化参数见下方
        namespace: [nameSpace], // 要拉取的文案空间，更多实例化参数见下方，
        locale: 'en', // starling平台上的语言码，
        zoneHost: 'https://starling-oversea.byteoversea.com', // 文案获取接口域名，v3 新增
        // TEAChannelDomain: 'https://mcs.zijieapi.com', // sdk 内部 tea 数据打点域名，v3 新增
        test: true,
        fallbackLang: ['en'],
        store: {
          set() {},
          get() {},
        },
      });
      starling.load().then(res => {
        console.log({ res });
        setI18nRes(res);
      });
    } else {
      setI18nRes(undefined);
    }
  }, [i18nKey, nameSpace]);

  // callbacks
  const setSchemaJson = useCallback(
    (action: SchemaActionType) =>
      setJson({
        action,
        pageJson,
        bizComponents,
        bizType,
        editorType,
        setPageJson: (json: EditorIPage) => {
          savePageJsonRecord(json);
          setPageJson(json);
        },
      }),
    [
      pageJson,
      currentRecordUuid,
      pageJsonRecordList,
      bizComponents,
      bizType,
      editorType,
    ],
  );

  const resetPageJson = useCallback(() => {
    if (pageJsonRecordList.findIndex(i => i.uuid === currentRecordUuid) === 0) {
      return;
    }
    savePageJsonRecord(defaultPageJson);
    setPageJson(defaultPageJson);
  }, [pageJsonRecordList, currentRecordUuid]);

  const savePageJsonRecord = useCallback(
    (getPageJson: EditorIPage) => {
      const copyJsonStr = JSON.stringify(getPageJson);
      const copyJson = JSON.parse(copyJsonStr);
      if (copyJsonStr === JSON.stringify(pageJsonRecordList.slice(-1))) {
        return;
      }

      const curIndex = pageJsonRecordList.findIndex(
        i => i.uuid === currentRecordUuid,
      );
      pageJsonRecordList.splice(curIndex + 1);

      const json = genRecord(copyJson);
      pageJsonRecordList.push(json);

      while (pageJsonRecordList.length > 50) {
        pageJsonRecordList.shift();
      }

      setCurrentRecordUuid(json.uuid);
      setPageJsonRecordList(pageJsonRecordList);
    },
    [pageJsonRecordList, currentRecordUuid],
  );

  const driveRecord = useCallback(
    (step = 0) => {
      if (step === 0) {
        return;
      }
      const curIndex = pageJsonRecordList.findIndex(
        i => i.uuid === currentRecordUuid,
      );

      if (curIndex + step < 0 || curIndex + step >= pageJsonRecordList.length) {
        return;
      }
      const { data, uuid } = pageJsonRecordList?.[curIndex + step] || {};
      if (data) {
        setCurrentRecordUuid(uuid);
        setPageJson(data);
      }
    },
    [pageJsonRecordList, currentRecordUuid, pageJson],
  );

  // effects
  useEffect(() => {
    if (editorType === EDITOR_TYPE.BIZ_PAGE) {
      if (pageJson) {
        const { biz_component_group_ids } = pageJson;
        pageConfigAPIClient
          .QueryBizComponentGroup({
            id: biz_component_group_ids?.[0],
          })
          .then(res => {
            const content = res.biz_component_group?.[0]?.content;
            if (content) {
              setBizComponents(JSON.parse(content));
            }
          });
      }
    }
  }, []);

  // undo redo short key cut
  useEffect(() => {
    document.removeEventListener('keydown', backRecordFn);
    backRecordFn = (evt: KeyboardEvent) => {
      if ((evt.ctrlKey || evt.metaKey) && evt.key.toLocaleLowerCase() === 'z') {
        setCurrentTargetId(undefined);
        driveRecord(evt.shiftKey ? 1 : -1);
      }
    };
    document.addEventListener('keydown', backRecordFn);
  }, [pageJsonRecordList, currentRecordUuid, pageJson]);

  useEffect(() => {
    const $relationList: any = document.querySelectorAll(
      `.${CLASS_NAMES.BIZ_BODY_WARPPER} .${CLASS_NAMES.BIZ_ACTIVE_CLICK_RELATION}`,
    );
    for (const $item of $relationList) {
      $item?.classList.remove(CLASS_NAMES.BIZ_ACTIVE_CLICK_RELATION);
    }
    currentRelationList.forEach(relationNodeId => {
      const $currentTarget = relationNodeId
        ? document.querySelector(
            `.${CLASS_NAMES.BIZ_BODY_WARPPER} [data-node-id="${relationNodeId}"]`,
          )
        : null;
      $currentTarget?.classList.add(CLASS_NAMES.BIZ_ACTIVE_CLICK_RELATION);
    });
  }, [currentRelationList]);

  useEffect(() => {
    const isSection =
      currentTargetJson?.current?.type === FORM_ITEM_TYPE.SECTION;

    const $currentTarget = currentTargetId
      ? document.querySelector(
          `.${CLASS_NAMES.BIZ_BODY_WARPPER} [data-node-id="${currentTargetId}"]`,
        )
      : null;

    // remove setion class name
    const $sectionList: any = document.querySelectorAll(
      `.${CLASS_NAMES.BIZ_BODY_WARPPER} .${CLASS_NAMES.BIZ_ACTIVE_SECTION_CLICK}`,
    );
    for (const $item of $sectionList) {
      $item?.classList.remove(CLASS_NAMES.BIZ_ACTIVE_SECTION_CLICK);
    }
    const $fieldList: any = document.querySelectorAll(
      `.${CLASS_NAMES.BIZ_BODY_WARPPER} .${CLASS_NAMES.BIZ_ACTIVE_FIELD_CLICK}`,
    );
    for (const $item of $fieldList) {
      $item?.classList.remove(CLASS_NAMES.BIZ_ACTIVE_FIELD_CLICK);
    }

    $currentTarget?.classList.add(
      isSection
        ? CLASS_NAMES.BIZ_ACTIVE_SECTION_CLICK
        : CLASS_NAMES.BIZ_ACTIVE_FIELD_CLICK,
    );
  }, [currentTargetId, currentTargetJson, schemaJson]);

  // hover status manage
  useEffect(() => {
    const hoverJson = getCurrentTargetById(schemaJson, hoverTargetId);

    // remove setion class name
    const $sectionList: any = document.querySelectorAll(
      `.${CLASS_NAMES.BIZ_BODY_WARPPER} .${CLASS_NAMES.BIZ_ACTIVE_SECTION_HOVER}`,
    );
    for (const $item of $sectionList) {
      $item?.classList.remove(CLASS_NAMES.BIZ_ACTIVE_SECTION_HOVER);
    }

    const $fieldList: any = document.querySelectorAll(
      `.${CLASS_NAMES.BIZ_BODY_WARPPER} .${CLASS_NAMES.BIZ_ACTIVE_FIELD_HOVER}`,
    );
    for (const $item of $fieldList) {
      $item?.classList.remove(CLASS_NAMES.BIZ_ACTIVE_FIELD_HOVER);
    }

    if (!hoverJson?.current) {
      return;
    }

    const isSection = hoverJson?.current?.type === FORM_ITEM_TYPE.SECTION;
    const $hoverTarget = hoverTargetId
      ? document.querySelector(
          `.${CLASS_NAMES.BIZ_BODY_WARPPER} [data-node-id="${hoverTargetId}"]`,
        )
      : null;

    $hoverTarget?.classList.add(
      isSection
        ? CLASS_NAMES.BIZ_ACTIVE_SECTION_HOVER
        : CLASS_NAMES.BIZ_ACTIVE_FIELD_HOVER,
    );
  }, [hoverTargetId, schemaJson]);

  return (
    <schemaContext.Provider
      value={{
        allI18nKeys,
        bizType,
        pageJson,
        schemaJson,
        editorType,
        bizComponents,
        currentTargetJson,
        currentRecordUuid,
        pageJsonRecordList,
        currentRelationList,
        t,
        setPageJson,
        setSchemaJson,
        setCurrentTargetId,
        setHoverTargetId,
        driveRecord,
        resetPageJson,
      }}>
      {children}
    </schemaContext.Provider>
  );
};

export default SchemaProvider;
