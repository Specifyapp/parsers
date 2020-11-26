import _ from 'lodash';
import tinycolor from 'tinycolor2';
import got from 'got';
import SVGO from 'svgo';
import { AllowedFormat, PartialRecord } from '../types';

const Libs = {
  _,
  tinycolor,
  got,
  SVGO,
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
  assets: {
    getSource: <T>(payload: string, responseType: 'text' | 'buffer' | 'json') => Promise<T>;
  };
};

export type LibsType = typeof Libs & { SpServices: SpServicesType };
