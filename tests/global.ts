import { AllowedFormat, FontToken, PartialRecord } from '../types';
import { Token } from '../types/tokens';
import _ from 'lodash';
import tinycolor from 'tinycolor2';
import got from 'got';
import * as seeds from '../seeds.json';

jest.mock('../parsers/global-libs', () => {
  return {
    _,
    tinycolor,
    got,
    SpServices: {
      font: {
        convert: async (payload: { postscriptName: string; formats: Array<AllowedFormat> }) => {
          let result: PartialRecord<AllowedFormat, string> = {};
          const inSeed = seeds.tokens.find(
            token =>
              token.type === 'font' &&
              (token.value as FontToken['value']).fontPostScriptName === payload.postscriptName,
          ) as FontToken;
          if (inSeed && inSeed.value.fontFileMissing) {
            throw new Error('Source file not found');
          }
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
