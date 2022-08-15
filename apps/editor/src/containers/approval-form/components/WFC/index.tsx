import React, { useEffect, useState } from 'react';
import { bpmSelectShare, getAuth, getTimeZone } from '@m4b-design/pearl-wfc';
import { useCommonParam } from '@i18n-ecom-op/hooks';
import { getQueryVariable } from '../../util';
import styles from './index.scss';
import WFCComponentDetail from './wfc';

interface DataMsg {
  noticeId: string;
  instId: string;
  taskId: string;
}
const testUrl = location.host.match('localhost')
  ? 'http://localhost:3099/wfc_api/client/v1/'
  : '';

const ApprovalWFC = () => {
  const [{ oec_region }] = useCommonParam();
  const [dataMsg, setDataMsg] = useState<any>(null);
  const [timeZone, setTimeZone] = useState<any>(null);

  const handleGetDataMsg = async (props: DataMsg) => {
    try {
      const { noticeId, instId, taskId } = props;
      const { data = null } = await bpmSelectShare({
        notice_id: noticeId,
        process_instance_id: instId,
        task_instance_id: taskId,
      });
      setDataMsg(data);
    } catch (e) {
      console.error('select_share接口获取参数失败======', e);
    }
  };

  let accessToken;

  useEffect(() => {
    (async () => {
      accessToken = (await getAuth())?.data;
    })();
    (async () => {
      const data = await getTimeZone({ region: oec_region });
      setTimeZone(data);
    })();
    const noticeId = getQueryVariable('noticeId') || '';
    const instId = getQueryVariable('instId') || '';
    const taskId = getQueryVariable('taskId') || '';
    if (noticeId || instId || taskId) {
      handleGetDataMsg({ noticeId, instId, taskId });
    }
  }, []);

  return (
    <>
      <div className={styles.blockStyle}>
        <div style={{ width: '100%', marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
            }}>
            <WFCComponentDetail
              type={'Forecast'}
              timezone={timeZone}
              dataMsg={dataMsg}
              testUrl={testUrl}
              curEnv={IS_BOE ? 'BOE' : 'PRD'}
              accessToken={accessToken}
            />
            <WFCComponentDetail
              type={'Decision'}
              timezone={timeZone}
              dataMsg={dataMsg}
              testUrl={testUrl}
              curEnv={IS_BOE ? 'BOE' : 'PRD'}
              accessToken={accessToken}
            />
          </div>
        </div>
        <WFCComponentDetail
          type={'Process'}
          dataMsg={dataMsg}
          testUrl={testUrl}
          curEnv={IS_BOE ? 'BOE' : 'PRD'}
          accessToken={accessToken}
        />
        <WFCComponentDetail
          type={'Discuss'}
          dataMsg={dataMsg}
          testUrl={testUrl}
          curEnv={IS_BOE ? 'BOE' : 'PRD'}
          accessToken={accessToken}
        />
      </div>
    </>
  );
};

export default ApprovalWFC;
