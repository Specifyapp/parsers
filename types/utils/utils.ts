export type AllowedFieldsWithType<Obj, Type> = {
  [K in keyof Obj]: Obj[K] extends Type ? K : never;
}[keyof Obj];

export interface DownloadableFile {
  name: string;
  value: {
    content?: string; // File content in string
    url?: string; // File we will download
  };
}
