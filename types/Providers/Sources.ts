import { AppFormat } from './Apps';

export interface FigmaSourceSettings {
  sourceType: 'frames' | 'localStyles';
  fileId: string;
  fileUrl: string;
  pageId?: string;
  framesIds?: Array<string>;
  teamId?: string;
}

export interface UrlSourceSettings {
  [key: string]: any;
}

export type SourceSettings = UrlSourceSettings | FigmaSourceSettings;

export type SourceStatusValue = 'on' | 'off' | 'error';

export interface Source {
  id: string;
  type: string;
  settings: SourceSettings;
  app: AppFormat;
  name: string;
  lastSyncedAt: Date;
  status: SourceStatusValue;
}
