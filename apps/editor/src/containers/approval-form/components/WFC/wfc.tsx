/* eslint-disable no-new */
import React, { useState } from 'react';
import {
  Decision,
  Forecast,
  Process,
  Discuss,
  Remind,
  ChatGroup,
} from '@m4b-design/pearl-wfc';
import { Message, Spin } from '@arco-design/web-react';
import { getQueryVariable } from '../../util';
import styles from './index.scss';
import { WFCComponentType } from './interface';

const WFCComponentDetail = React.memo<WFCComponentType>(
  ({ type, dataMsg, testUrl, curEnv, accessToken, timezone }) => {
    const [loading, setLoading] = useState(true);
    const process_definition_key =
      dataMsg?.process_definition_key || 'usrow_shp_test_notice';
    const process_instance_id =
      getQueryVariable('instId') || dataMsg?.process_instance_id;

    const task_instance_id =
      getQueryVariable('taskId') || dataMsg?.task_instance_id;

    if (process_instance_id && task_instance_id) {
      switch (type) {
        case 'ChatGroup':
          return (
            <Spin dot={true} loading={loading} style={{ width: '100%' }}>
              <div className={styles.exampleDemoBoxMin} key="ChatGroup">
                <ChatGroup
                  i18n="en"
                  wfcApiPath={testUrl}
                  env={curEnv}
                  timeZone={timezone as any}
                  accessToken={accessToken}
                  onRequestResult={(data: any) => {
                    if (data.result === true) {
                      setLoading(false);
                    }
                  }}
                  processInstanceId={process_instance_id}
                  // task_instance_id
                  // @ts-ignore
                  taskId={task_instance_id}
                />
              </div>
            </Spin>
          );
        case 'Decision':
          return (
            <Spin dot={true} loading={loading} style={{ width: '100%' }}>
              <div className={styles.exampleDemoBoxMin} key="Decision">
                <Decision
                  i18n="en"
                  timeZone={timezone as any}
                  accessToken={accessToken}
                  wfcApiPath={testUrl}
                  onDecisionClick={data => {
                    Message.info(data.message);
                    window.location.reload();
                  }}
                  env={curEnv}
                  onRequestResult={(data: any) => {
                    if (data.result === true) {
                      setLoading(false);
                    }
                  }}
                  // process_instance_id
                  processInstanceId={process_instance_id}
                  // task_instance_id
                  taskId={task_instance_id}
                />
              </div>
            </Spin>
          );
        case 'Discuss':
          return (
            <Spin dot={true} loading={loading} style={{ width: '100%' }}>
              <div key="Discuss">
                <Discuss
                  i18n="en"
                  timeZone={timezone as any}
                  accessToken={accessToken}
                  wfcApiPath={testUrl}
                  env={curEnv}
                  onRequestResult={(data: any) => {
                    if (data.result === true) {
                      setLoading(false);
                    }
                  }}
                  processInstanceId={process_instance_id}
                />
              </div>
            </Spin>
          );
        case 'Process':
          return (
            <Spin dot={true} loading={loading} style={{ width: '100%' }}>
              <div key="Process">
                <Process
                  i18n="en"
                  timeZone={timezone as any}
                  accessToken={accessToken}
                  wfcApiPath={testUrl}
                  env={curEnv}
                  onRequestResult={(data: any) => {
                    if (data.result === true) {
                      setLoading(false);
                    }
                  }}
                  processInstanceId={process_instance_id}
                  // @ts-ignore
                  taskId={task_instance_id}
                />
              </div>
            </Spin>
          );
        case 'Forecast':
          return (
            <Spin dot={true} loading={loading} style={{ width: '100%' }}>
              <div key="Forecast">
                <Forecast
                  i18n="en"
                  timeZone={timezone as any}
                  accessToken={accessToken}
                  wfcApiPath={testUrl}
                  env={curEnv}
                  processInstanceId={process_instance_id}
                  onRequestResult={(data: any) => {
                    if (data.result === true) {
                      setLoading(false);
                    }
                  }}
                />
              </div>
            </Spin>
          );
        case 'Remind':
          return (
            <div key="Remind" className={styles.exampleDemoBoxMin}>
              <Remind
                i18n="en"
                timeZone={timezone as any}
                accessToken={accessToken}
                wfcApiPath={testUrl}
                env={curEnv}
                processInstanceId={process_instance_id}
              />
            </div>
          );
        default:
          return null;
      }
    }
    return null;
  },
);

export default WFCComponentDetail;
