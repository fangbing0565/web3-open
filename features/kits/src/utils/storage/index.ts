export function getStorage(key: string) {
    try {
      const data = JSON.parse(window.localStorage.getItem(key) || '');
      return data?.originData || '';
    } catch (e) {
      return '';
    }
  }
  
  export function setStorage(key: string, data: any) {
    try {
      return window.localStorage.setItem(
        key,
        JSON.stringify({
          originData: data,
        }),
      );
    } catch (e) {
      return '';
    }
  }
  
  export function removeStorage(key: string) {
    return window.localStorage.removeItem(key);
  }
  