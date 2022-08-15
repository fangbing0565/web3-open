import { Button, Input, Modal, Select, Table } from '@arco-design/web-react';
import { IconDelete, IconDown, IconUp } from '@arco-design/web-react/icon';
import { IField, ISection } from '@oec-open/ttspc-render';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { schemaContext } from '../components/schema-provider';

export enum VALIDATOR_ITEMS {
  LENGTH = 'max string length',
  COUNT = 'max file count',
  MAX_IMAGE_WIDTH = 'max image width',
  NOT_EQUAL = 'is not equal to',
  EQUAL = 'is equal to',
  NONE = 'is none',
  NOT_NONE = 'is not none',
  REGULAR = 'regular',
}

const validatorConditions: {
  [key: string]: string[];
} = {
  string: [
    VALIDATOR_ITEMS.LENGTH,
    VALIDATOR_ITEMS.NOT_EQUAL,
    VALIDATOR_ITEMS.EQUAL,
    VALIDATOR_ITEMS.NOT_NONE,
    VALIDATOR_ITEMS.NONE,
    VALIDATOR_ITEMS.REGULAR,
  ],
};

export type ValidatorRuleItem = {
  condition?: string;
  field?: string;
  value?: string;
  message?: string;
};

const RenderValidatorCell: FC<PropsWithChildren<any>> = props => {
  const { allI18nKeys } = useContext(schemaContext);
  const {
    children,
    rowData,
    column,
    onHandleSave,
    conditions,
    allFields,
  } = props;
  const [value, setValue] = useState(rowData[column.dataIndex]);

  const onChangeItem = (val: string) => {
    setValue(val);
  };

  const saveRowData = () => {
    rowData[column.dataIndex] = value;
    onHandleSave(rowData);
  };

  if (column.title === 'Operation') {
    return children;
  }

  if (column.title === 'Condition') {
    return (
      <Select
        size="default"
        options={conditions}
        value={value}
        onBlur={saveRowData}
        onChange={onChangeItem}
        placeholder="please select condition"
      />
    );
  }

  if (column.title === 'Field') {
    return (
      <Select
        size="default"
        options={allFields}
        value={value}
        onBlur={saveRowData}
        onChange={onChangeItem}
        placeholder="please select filed"
      />
    );
  }

  if (column.title === 'Message' && allI18nKeys?.length) {
    return (
      <Select
        size="default"
        options={allI18nKeys}
        value={value}
        onBlur={saveRowData}
        onChange={onChangeItem}
        allowCreate={true}
        showSearch={true}
        placeholder="please select or create message"
      />
    );
  }

  return (
    <Input
      value={value}
      size="default"
      onBlur={saveRowData}
      onChange={onChangeItem}
      disabled={props?.disabled}
    />
  );
};

const BizValidator = (customProps: any, props: any, field: string) => {
  const [showPropsModal, setShowPropsModal] = useState(false);
  const { valueType = 'string' } = customProps || {};
  const conditions = validatorConditions[valueType];
  const { pageJson } = useContext(schemaContext);

  const values = props.value?.map((i: any) => {
    if (typeof i === 'string') {
      return {
        condition: undefined,
        field,
        value: undefined,
        message: undefined,
      };
    } else if (Object.prototype.toString.call(i) === '[object Object]') {
      return i;
    }
    return {};
  });
  const [value, setValue] = useState(values || []);
  const onChangeValue = useCallback(
    (value: any) => {
      const changeValue =
        value?.map((i: any) => {
          delete i?.undefined;
          return i;
        }) || [];
      setValue(value);
      props.onChange(changeValue);
    },
    [value, props],
  );
  const handleSave = useCallback(
    (row, index: number) => {
      const newData = [...props.value];
      newData[index] = row;
      onChangeValue(newData);
    },
    [props],
  );
  const columns = useMemo(() => {
    const cols: any[] = ['Condition', 'Field', 'Value', 'Message'].map(
      (i: any) => ({
        dataIndex: i.toLocaleLowerCase(),
        title: i,
        editable: true,
      }),
    );
    if (!props?.disabled) {
      cols.push({
        title: 'Operation',
        width: 120,
        fixed: 'right',
        render: (_: any, __: any, index: number) => (
          <>
            <Button
              size="small"
              onClick={() => {
                value.splice(index, 1);
                onChangeValue(value);
              }}
              iconOnly={true}
              icon={<IconDelete />}
              type="primary"
              status="danger"
            />
            <Button
              style={{ margin: '0 5px' }}
              size="small"
              onClick={() => {
                [value[index - 1], value[index]] = [
                  value[index],
                  value[index - 1],
                ];
                onChangeValue(value);
              }}
              iconOnly={true}
              disabled={index === 0}
              icon={<IconUp />}
              type="primary"
            />
            <Button
              size="small"
              disabled={index === value.length - 1}
              onClick={() => {
                [value[index + 1], value[index]] = [
                  value[index],
                  value[index + 1],
                ];
                onChangeValue(value);
              }}
              iconOnly={true}
              icon={<IconDown />}
              type="primary"
            />
          </>
        ),
      });
    }
    return cols;
  }, [props]);

  const allFields = useMemo(() => {
    const list: string[] = [];
    pageJson?.content.body.sections.forEach((section: ISection) => {
      section.children?.forEach((field: IField) => {
        list.push(field.field);
      });
    });
    return list;
  }, [pageJson]);
  return (
    <>
      <Button onClick={() => setShowPropsModal(true)} type="primary">
        Edit validator options
      </Button>
      <Modal
        hideCancel={true}
        visible={showPropsModal}
        title="Edit Options"
        style={{ width: 1200 }}
        onOk={() => setShowPropsModal(false)}
        onCancel={() => setShowPropsModal(false)}>
        {!props?.disabled && (
          <Button
            type="primary"
            style={{ marginBottom: 5 }}
            onClick={() => {
              value.push({
                condition: undefined,
                field,
                value: undefined,
                message: undefined,
              });
              onChangeValue(value);
            }}>
            Add
          </Button>
        )}
        <Table
          key={JSON.stringify(value)}
          columns={columns.map((column: any) =>
            column.editable
              ? {
                  ...column,
                  onCell: (_: any, index: number) => ({
                    onHandleSave: (props: any) => {
                      handleSave(props, index);
                    },
                  }),
                }
              : column,
          )}
          data={value}
          pagination={false}
          components={{
            body: {
              cell: (p: any) => (
                <RenderValidatorCell
                  {...p}
                  disabled={props.disabled}
                  conditions={conditions}
                  allFields={allFields}
                />
              ),
            },
          }}
        />
      </Modal>
    </>
  );
};

const BizValidatorRender = (customProps: any, field: string) => (props: any) =>
  BizValidator(customProps, props, field);

export default BizValidatorRender;
