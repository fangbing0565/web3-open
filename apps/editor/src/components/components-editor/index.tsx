import React, { useState, FC, PropsWithChildren, useEffect } from 'react';
import arcoCss from '@oec-open/ttspc-biz-comp-theme';
import { IBody, IField, ISection } from '@oec-open/ttspc-render';
import BizCompGroup from './components/biz-comp-group';
import BizCompBody from './components/biz-comp-body';
import BizCompProp from './components/biz-comp-prop';
import Playground from './components/playground';
import styles from './index.scss';
import SchemaProvider from './components/schema-provider';
import { EditorIPage } from './utils/type';

export type CurrentTargetJsonType = {
  current: IField | ISection | undefined;
  parent: ISection | IBody | undefined;
};

export enum EDITOR_TYPE {
  BIZ_GROUP = 'bizGroup',
  BIZ_PAGE = 'bizPage',
}

export type I18nOptionsType = {
  i18n_key: string;
  name_spance: string;
};

export type BizComponentEditorType = {
  defaultPageJson: EditorIPage;
  saveJsonApi: (json: EditorIPage) => Promise<any>;
  editorType: EDITOR_TYPE;
  bizType: number;
};

let changeEditModeFn: any;

const BizComponentEditor: FC<PropsWithChildren<BizComponentEditorType>> = ({
  defaultPageJson,
  saveJsonApi,
  editorType,
  bizType,
}) => {
  const [renderPlay, setRenderPlay] = useState(false);

  const changeRenderMode = () => {
    setRenderPlay(!renderPlay);
  };

  // Save short cut key
  useEffect(() => {
    document.removeEventListener('keydown', changeEditModeFn);
    changeEditModeFn = (evt: KeyboardEvent) => {
      console.log({ evt });
      if (
        (evt.ctrlKey || evt.metaKey) &&
        evt.key.toLocaleLowerCase() === 'l' &&
        evt.shiftKey
      ) {
        changeRenderMode();
        evt.preventDefault();
      }
    };
    document.addEventListener('keydown', changeEditModeFn);
    return () => {
      document.removeEventListener('keydown', changeEditModeFn);
    };
  }, [renderPlay]);

  return (
    <div>
      <style>{arcoCss}</style>
      <div className={styles.bizContainer}>
        <SchemaProvider
          defaultPageJson={defaultPageJson}
          bizType={bizType}
          editorType={editorType}>
          <BizCompGroup />
          <BizCompBody saveJsonApi={saveJsonApi} />
          {renderPlay ? <Playground /> : <BizCompProp />}
        </SchemaProvider>
      </div>
    </div>
  );
};

export default BizComponentEditor;
