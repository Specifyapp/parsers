import { SpServicesType } from '../parsers/global-libs';

export * from './tokens';
export * from './Providers';
export * from './utils/utils';

declare global {
  namespace NodeJS {
    interface Global {
      SpServices: SpServicesType;
    }
  }
}
export type FontsFormat = 'woff2' | 'woff' | 'otf' | 'ttf' | 'eot';

export type Parser = {
  name: string;
  options?: any;
};

export type ColorsFormat =
  | 'rgb'
  | 'prgb'
  | 'hex'
  | 'hex6'
  | 'hex3'
  | 'hex4'
  | 'hex8'
  | 'name'
  | 'hsl'
  | 'hsv';
