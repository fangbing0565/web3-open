declare interface Window {
    Tea: any;
    __FP_BEGIN__: number;
    // tea Event reporting function
    // https://bytedance.feishu.cn/docs/doccnTfGUAmzvQ8EXptVVEFSryi#
    collectEvent(method: string, config: any): void;
    // slardarError report，Initialized injupiter.config.jsComplete at build time
    // https://slardar.bytedance.net/docs/115/150/3471/
    Slardar(key: string, ...other: any): void;
  }
  