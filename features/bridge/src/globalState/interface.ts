export type event = (symbol|string);

export type eventNS = string|event[];
export interface ListenerFn {
  (values: any): void;
}

export type Domain = string;
