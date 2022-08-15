import React, { useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { Alert } from '@i18n-ecom/ui';
import { IconRefresh } from '@arco-design/web-react/icon';
import cs from 'classnames';
import { captureSchemaJsonError } from '../utils/capture-error';
import styles from '../index.scss';
import { SCHEMA_ACTION } from '../utils/set-schema-json';
import { schemaContext } from './schema-provider';

const Playground = () => {
  const { schemaJson, setSchemaJson, pageJson } = React.useContext(
    schemaContext,
  );

  const [code, setCode] = React.useState('');
  const [schemaError, setSchemaError] = React.useState('');

  useEffect(() => {
    if (!schemaError) {
      setCode(JSON.stringify(pageJson, null, 2));
    }
  }, [pageJson, schemaError]);

  const onChangeEditor = React.useCallback(
    (val: string) => {
      setCode(val);
      const { data, error, success } = captureSchemaJsonError(val, pageJson);
      setSchemaError(error);
      if (!error && success) {
        setSchemaJson({
          type: SCHEMA_ACTION.UPDATE_JSON,
          payload: { data },
        });
      }
    },
    [pageJson, schemaJson],
  );

  return (
    <div
      className={styles.bizPlayground}
      onClick={e => {
        e.stopPropagation();
      }}>
      <MonacoEditor
        language="json"
        options={{
          selectOnLineNumbers: false,
          formatOnPaste: true,
          lineNumbersMinChars: 2,
          autoIndent: 'keep',
          tabSize: 2,
          wordWrap: 'on',
          wordWrapColumn: 40,
          minimap: {
            enabled: false,
          },
        }}
        theme="vs-dark"
        value={code}
        onChange={onChangeEditor}
      />
      {schemaError ? (
        <div className={styles.schemaError}>
          <Alert
            content={schemaError}
            type="error"
            closable={true}
            style={{ border: 'none', borderRadius: '0' }}
            onClose={() => setSchemaError('')}
            closeElement={<IconRefresh />}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Playground;
