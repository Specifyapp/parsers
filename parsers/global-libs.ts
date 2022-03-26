import _ from 'lodash';
import tinycolor from 'tinycolor2';
import SVGO from 'svgo';
import Mustache from 'mustache';
import { FontsFormat, PartialRecord } from '../types';
import { MustacheStatic } from '../types/libs/mustache';

declare module 'lodash' {
  export interface LoDashStatic {
    pascalCase(string?: string): string;
  }
}
_.mixin({ pascalCase: _.flow(_.camelCase, _.upperFirst) });

const Libs = {
  _,
  SVGO,
  tinycolor,
  Mustache: Mustache as MustacheStatic,
  // SpServices is appended to libs during the runtime
};

export default Libs;

export type SpServicesType = {
  font: {
    convert: (payload: {
      postscriptName: string;
      formats: Array<FontsFormat>;
    }) => Promise<PartialRecord<FontsFormat, string>>;
  };
  assets: {
    getSource: <T>(payload: string, responseType: 'text' | 'buffer' | 'json') => Promise<T>;
  };
};

// @ts-ignore
export const SpServices: SpServicesType = {};

export type LibsType = typeof Libs & { SpServices: SpServicesType };
