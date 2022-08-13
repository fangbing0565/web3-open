import 'i18next';
declare module 'i18next' {
  interface TFunction {
    (key: string, ...rest: Array<string | number>): string;
  }
}
