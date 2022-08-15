import {
    BpmGetAuthData,
    BpmSelectShareData,
  } from '@m4b-design/pearl-wfc/es/api';
  import { CSSProperties } from 'react';
  
  export interface IBase {
    processInstanceId: string;
    style?: CSSProperties;
    className?: string;
    i18n?: string;
    defKey?: string;
    chatCardOnProduction?: boolean;
    chatCardOnPre?: boolean;
    orderNumber?: boolean;
    formatDataCallback?: () => void;
  }
  
  export interface IForecastProps extends IBase {
    descAgentSubmit?: boolean;
    promptingFlag?: boolean;
  }
  
  export interface IProcessProps extends IBase {
    hideReadInfo?: boolean;
  }
  
  export interface IDecisionProps
    extends Omit<
      IBase,
      'chatCardOnProduction' | 'chatCardOnPre' | 'defKey' | 'orderNumber'
    > {
    taskId: string;
    noticeTheme?: boolean;
    urgeTheme?: boolean;
    hideUrge?: boolean;
    closeUpload?: boolean;
    closeCommonLanguage?: boolean;
    businessCode?: string;
    agent?: string;
    onDecisionClick?: (data: Record<string, any>) => void;
    onRequestResult?: (data: Record<string, any>) => void;
  }
  
  export interface IDiscussProps extends IBase {
    onDecisionClick?: (data: Record<string, any>) => void;
    onRequestResult?: (data: Record<string, any>) => void;
  }
  
  export interface IRemind
    extends Omit<IBase, 'chatCardOnProduction' | 'chatCardOnPre'> {
    modalPosition?: 'left' | 'right' | 'center';
  }
  
  export interface ISubmitForecast
    extends Omit<
      IBase,
      'chatCardOnProduction' | 'chatCardOnPre' | 'defKey' | 'orderNumber'
    > {
    value: boolean;
    initiatorId: string;
    processDefinitionKey: string;
    processDefinitionId?: string;
    businessKey?: string;
    transientVariable?: string;
    padding?: number;
    resetPosition?: boolean;
    onSubmitForecastRemind?: (data: string) => void;
  }
  
  export interface IChatGroup extends IBase {
    bizNum: string;
  }
  
  export interface BpmSelectShareResponse {
    code: number;
    message: string;
    data?: BpmSelectShareData;
  }
  export interface WFCComponentType {
    type: string;
    testUrl: string;
    curEnv: 'BOE' | 'PRE' | 'PRD' | undefined;
    timezone?: string;
    dataMsg?: BpmSelectShareData;
    accessToken?: BpmGetAuthData;
  }
  