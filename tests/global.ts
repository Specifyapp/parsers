import { AllowedFormat, PartialRecord } from '../types';
import _ from 'lodash';
import tinycolor from 'tinycolor2';
import got from 'got';

jest.mock('../parsers/global-libs', () => {
  return {
    _,
    tinycolor,
    got,
    SpServices: {
      font: {
        convert: async (payload: { postscriptName: string; formats: Array<AllowedFormat> }) => {
          let result: PartialRecord<AllowedFormat, string> = {};
          await Promise.all(
            payload.formats.map(async format => {
              result[format] = `${payload.postscriptName}.${format}`;
            }),
          );
          return result;
        },
      },
    },
  };
});
