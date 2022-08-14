export const getEnv = () => {
    return (window as any)?.gfdatav1?.env;
  };
  
  export const isProd = () => {
    return getEnv() === 'prod';
  };
  
  export const isOnline = () => {
    return process.env.BUILD_TYPE === 'online';
  }
  
  export const isBOE = () => {
    return process.env.BUILD_TYPE === 'offline' || process.env.BUILD_TYPE === undefined;
  }
  
  