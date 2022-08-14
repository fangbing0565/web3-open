import OTea, {
    Collector,
    IInitParam,
    IConfigParam,
  } from '@dp/byted-tea-sdk-oversea';
  
  export class TeaClass {
    private tracker?: OTea;
  
    initTea(config: IInitParam, start?: boolean) {
      const tracker = new Collector(`${config.app_id}`);
      this.tracker = tracker;
      this.tracker.init(config);
      if (start) this.tracker.start();
    }
  
    configTea(config: IConfigParam, start?: boolean) {
      this.tracker?.config(config);
      if (start) this.tracker?.start();
    }
  
    startTea(config?: IConfigParam) {
      this.tracker?.config(config);
      this.tracker?.start();
    }
  
    addCommonTeaParams(payload: Record<string, any>) {
      this.tracker?.config({ ...OTea.getConfig(), payload });
    }
  
    sendTeaLog(key: string, payload?: Record<string, any>) {
      this.tracker?.event(key, payload);
    }
  }
  
  export const Tea = new TeaClass()
  