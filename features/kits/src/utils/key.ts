import { useMemo } from "react";

let counter = 0;
export function genLocalKey(prefix = 'key') {
  return `${prefix}_${++counter}`;
}

interface PromiseRejector {
  (): Promise<void>;
  reject?: (f?: any) => void;
}

function rejectorFactory() {
  return function promiseRejector() {
    return new Promise(function (resolve, reject) {
      // @ts-ignore
      promiseRejector.reject = reject;
    });
  } as PromiseRejector;
}

export function usePromiseRejector() {
  const rejector = useMemo(rejectorFactory, []);
  return rejector;
}
