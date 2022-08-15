import React, { CSSProperties, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Modal, Input, Message } from '@i18n-ecom/ui';
import { categoryRuleAPIClient } from '@/api/operation/serv/oec_operation_category_rule_api';
import {
  FeCategoryTreeVersion,
  FeAction,
} from '@/api/operation/data/category_rule';
import { useData } from '@i18n-ecom-op/block-page-table';
import { useKaniPermission } from '@i18n-ecom-op/api-hooks';
import styles from './index.scss';

interface Props {
  record: FeCategoryTreeVersion;
}
const VersionAction = ({ record }: Props) => {
  const { mutate } = useData();
  const [showAction, setShowAction] = useState(true);
  const { validate } = useKaniPermission();
  const isActionPermission = validate('action_fe_category_tree');
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const handleClick = async (args: {
    action: number;
    tree_id: string;
    version_id: string;
    version_name: string;
  }) => {
    if (!showAction) {
      return;
    }
    setShowAction(false);
    const { tree_id, version_id, version_name } = args;
    try {
      switch (args.action) {
        case 1: //送审
          Modal.confirm({
            content: (
              <div className={styles.modalConfirm}>
                {`Are you sure you want to audit version ${version_name}?`}
              </div>
            ),
            onConfirm: async () => {
              try {
                console.log('送审:', tree_id, version_id);
                const result = await categoryRuleAPIClient.AuditFeCategoryTree({
                  tree_id,
                  version_id,
                });
                const { message } = result;
                Message.success(message);
                await mutate();
              } catch (error) {
                Message.error(error.message);
              }
            },
          });
          break;
        case 2: //取消送审
          // categoryRuleAPIClient.CancelAuditFeCategoryTree({tree_id,version_id})
          Modal.confirm({
            content: (
              <div className={styles.modalConfirm}>
                {`Are you sure you want to cancel the audit of version ${version_name}?`}
              </div>
            ),
            onConfirm: async () => {
              try {
                const result = await categoryRuleAPIClient.CancelAuditFeCategoryTree(
                  {
                    tree_id,
                    version_id,
                  },
                );
                const { message } = result;
                Message.success(message);
                await mutate();
              } catch (error) {
                Message.error(error.message);
              }
            },
          });
          break;
        case 3: //创建新版本
          // categoryRuleAPIClient.CopyNewVersionCategoryTree({tree_id,copy_version_id,version_name })

          Modal.confirm({
            content: (
              <Form form={form} layout={'vertical'}>
                <FormItem
                  label="Please input a version name"
                  field="version_name"
                  rules={[{ required: true }]}>
                  <Input />
                </FormItem>
              </Form>
            ),
            onConfirm: async () => {
              try {
                const new_version_name = form.getFieldValue('version_name');
                const copy_version_id = version_id;
                const result = await categoryRuleAPIClient.CopyNewVersionCategoryTree(
                  {
                    tree_id,
                    copy_version_id,
                    version_name: new_version_name,
                  },
                );
                const { message } = result;
                Message.success(message);
                await mutate();
              } catch (error) {
                Message.error(error.message);
              }
            },
          });
          break;
        case 4: //发布
          Modal.confirm({
            content: (
              <div className={styles.modalConfirm}>
                {`Are you sure you want to publish the audit of version ${version_name}?`}
              </div>
            ),
            onConfirm: async () => {
              try {
                const result = await categoryRuleAPIClient.PublishFeCategoryTree(
                  {
                    tree_id,
                    version_id,
                  },
                );
                const { message } = result;
                Message.success(message);
                await mutate();
              } catch (error) {
                Message.error(error.message);
              }
            },
          });
          break;
        default:
          return;
      }
    } catch {
      console.log('hi');
    } finally {
      setShowAction(true);
    }
  };
  return (
    <div className="flex flex-col">
      <Link
        className="no-underline text-brand font-semibold"
        to={`/partner/fe-category/version/${record.tree_id}/view/${record.version_id}`}>
        View
      </Link>
      {isActionPermission ? (
        record.fe_actions?.map((item: number) => {
          return (
            (item === FeAction.FE_ACTION_SEND_AUDIT && (
              <div
                className="no-underline text-brand font-semibold"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  handleClick({
                    action: 1,
                    tree_id: record.tree_id,
                    version_id: record.version_id,
                    version_name: record.version_name,
                  })
                }>
                Submit Version
              </div>
            )) ||
            (item === FeAction.FE_ACTION_CANCEL_AUDIT && (
              <div
                className="no-underline text-brand font-semibold"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  handleClick({
                    action: 2,
                    tree_id: record.tree_id,
                    version_id: record.version_id,
                    version_name: record.version_name,
                  })
                }>
                Cancel Submit
              </div>
            )) ||
            (item === FeAction.FE_ACTION_GEN_NEW_VERSION && (
              <div
                className="no-underline text-brand font-semibold"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  handleClick({
                    action: 3,
                    tree_id: record.tree_id,
                    version_id: record.version_id,
                    version_name: record.version_name,
                  })
                }>
                Generate New Version
              </div>
            )) ||
            (item === FeAction.FE_ACTION_PUBLISH && (
              <div
                className="no-underline text-brand font-semibold"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  handleClick({
                    action: 4,
                    tree_id: record.tree_id,
                    version_id: record.version_id,
                    version_name: record.version_name,
                  })
                }>
                Publish
              </div>
            ))
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default VersionAction;
