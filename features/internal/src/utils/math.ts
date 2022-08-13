export function getUUID() {
    return String(Math.random()).slice(-8);
  }
  
  export function injectId<T = any>(item: T, key = 'id') {
    return {
      ...item,
      [key]: getUUID(),
    }
  }
  