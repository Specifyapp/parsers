import _ from 'lodash';
import tinycolor from 'tinycolor2';
import got from 'got';
import { AllowedFormat } from '../types/tokens';
import { PartialRecord } from '../types';

const Libs = {
  _,
  tinycolor,
  got,
  // SpServices is appended to libs object during the runtime
};

export default Libs;

type SpServicesType = {
  font: {
    convert: (payload: {
      postscriptName: string;
      formats: Array<AllowedFormat>;
    }) => Promise<PartialRecord<AllowedFormat, string>>;
  };
};

export type LibsType = typeof Libs & { SpServices: SpServicesType };
