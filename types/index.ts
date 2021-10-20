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

