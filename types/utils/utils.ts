export type AllowedFieldsWithType<Obj, Type> = {
  [K in keyof Obj]: Obj[K] extends Type ? K : never;
}[keyof Obj];

export interface DownloadableFile {
  name: string;
  value: {
    fileName?: string;
    content?: string; // File content in string
    url?: string; // File we will download
  };
}

export type LinkableTokensSignaturesValue = Record<string, string>;
export interface LinkableTokensSignatures {
  color: LinkableTokensSignaturesValue;
  measurement: LinkableTokensSignaturesValue;
}

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
export type Assign<A, B> = Omit<A, keyof B> & B;
export type Await<T> = T extends PromiseLike<infer U> ? U : T;

export type RecursiveRecord<T> = Record<PropertyKey, T | Record<PropertyKey, T>>;

export type ObjectKeys<T> = T extends object
  ? (keyof T)[]
  : T extends number
  ? []
  : T extends Array<any> | string
  ? string[]
  : never;
