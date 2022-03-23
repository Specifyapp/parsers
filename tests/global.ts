import { FontsFormat, FontToken, PartialRecord } from '../types';
import seeds from '../tests/seeds';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

jest.mock('../parsers/global-libs', () => {
  const { default: globalLibs } = jest.requireActual('../parsers/global-libs');
  return {
    ...globalLibs,
    SpServices: {
      font: {
        convert: async (payload: { postscriptName: string; formats: Array<FontsFormat> }) => {
          let result: PartialRecord<FontsFormat, string> = {};
          const inSeed = seeds().tokens.find(
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
      assets: {
        getSource<T>(url: string, responseType: 'text' | 'buffer' | 'json') {
          try {
            const content = fs.readFileSync(
              path.join(
                __dirname,
                'fixtures',
                'assets',
                crypto.createHash('md5').update(url).digest('hex'),
              ),
            );
            if (responseType === 'text') return content.toString('utf-8');
            if (responseType === 'json') return JSON.parse(content.toString());
            if (responseType === 'buffer') return content;
          } catch (err) {
            return new Error('Get source failed');
          }
        },
      },
    },
  };
});
