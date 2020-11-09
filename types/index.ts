import { AllowedFormat } from './tokens';
import { PartialRecord } from './utils/utils';

export * from './tokens';
export * from './Providers';
export * from './utils/utils';
export * from './dsp/dsp';

declare global {
  namespace NodeJS {
    interface Global {
      SpServices: SpServicesTypes;
    }
  }
}

export type SpServicesTypes = {
  font: {
    convert: (payload: {
      postscriptName: string;
      formats: Array<AllowedFormat>;
    }) => Promise<PartialRecord<AllowedFormat, string>>;
  };
};
