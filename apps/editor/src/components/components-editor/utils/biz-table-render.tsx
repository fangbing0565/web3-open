import { Button, Input, Modal, Select, Table } from '@arco-design/web-react';
import { IconDelete, IconDown, IconUp } from '@arco-design/web-react/icon';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { schemaContext } from '../components/schema-provider';

const RenderCell: FC<PropsWithChildren<any>> = props => {
  const { allI18nKeys } = useContext(schemaContext);
  const { children, rowData, column, onHandleSave } = props;
  const [value, setValue] = useState(rowData[column.dataIndex]);

  const onChangeItem = (value: string) => {
    setValue(value);
  };

  const saveRowData = () => {
    rowData[column.dataIndex] = value;
    onHandleSave(rowData);
  };

  if (column.title === 'Operation') {
    return children;
  }

  if (column.title === 'label' && allI18nKeys?.length) {
    return (
      <Select
        size="default"
        options={allI18nKeys}
        showSearch={true}
        allowCreate={true}
        value={value}
        onBlur={saveRowData}
        onChange={onChangeItem}
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

const BizTable = (props: any) => {
  const [showPropsModal, setShowPropsModal] = useState(false);
  const values = props.value?.map((i: any) => {
    if (typeof i === 'string') {
      return {
        label: i,
        value: i,
        key: i,
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
    const cols: any[] = ['label', 'value', 'key'].map((i: any) => ({
      dataIndex: i,
      title: i,
      editable: true,
      width: i === 'label' ? 500 : '',
    }));
    if (!props?.disabled) {
      cols.push({
        title: 'Operation',
        width: 120,
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
                console.log({ value });
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
                console.log({ value });
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
  return (
    <>
      <Button onClick={() => setShowPropsModal(true)} type="primary">
        Edit options
      </Button>
      <Modal
        hideCancel={true}
        visible={showPropsModal}
        title="Edit Options"
        style={{ width: 1000 }}
        onOk={() => setShowPropsModal(false)}
        onCancel={() => setShowPropsModal(false)}>
        {!props?.disabled && (
          <Button
            type="primary"
            style={{ marginBottom: 5 }}
            onClick={() => {
              const obj: { [key: string]: string } = {};
              columns.forEach((col: { title: string; dataIndex: string }) => {
                obj[col.dataIndex] = col.dataIndex;
              });
              value.push(obj);
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
              cell: (p: any) => <RenderCell {...p} disabled={props.disabled} />,
            },
          }}
        />
      </Modal>
    </>
  );
};

const BizTableRender = () => BizTable;

export default BizTableRender;
