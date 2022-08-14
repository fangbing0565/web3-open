export enum PEARL_APP_ID_CONFIG {
    TTS = 5969,
    // S = 325635,
  }
  
  export const ENV_CONFIG: Record<string | number, string> = {
    [PEARL_APP_ID_CONFIG.TTS]: 'tts',
    // [PEARL_APP_ID_CONFIG.S]: 's',
  };
  
  // todo s tea config
  export const TEA_CONFIG: Record<string | number, string | number> = {
    [PEARL_APP_ID_CONFIG.TTS]: 5969,
    // [PEARL_APP_ID_CONFIG.S]: 0,
  };
  
  export const SLARDAR_CONFIG: Record<string | number, string> = {
    [PEARL_APP_ID_CONFIG.TTS]: 'oec_op',
    // [PEARL_APP_ID_CONFIG.S]: 'oec_s',
  };
  
  export const EXTENSION: Record<string | number, string> = {
    [PEARL_APP_ID_CONFIG.TTS]: 'tts',
    // [PEARL_APP_ID_CONFIG.S]: 's',
  };
  
  export const DEV_PORT: Record<string | number, number | string> = {
    [PEARL_APP_ID_CONFIG.TTS]: 3099,
    // [PEARL_APP_ID_CONFIG.S]: 5099,
  };
  
  export const APP_ID = 359713;
  // export const IS_TTPP = process.env.
  