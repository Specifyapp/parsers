import { FontsFormat } from '../../types';
import { PartialRecord } from '../../types';
// todo: rename the specify api
import { SpServices } from '../global-libs';
import * as _ from 'lodash';

export type InputDataType = Array<{
  value: {
    fontPostScriptName: string;
    fontFamily?: string;
    fontWeight?: string | number;
    [Key: string]: any;
  };
  [Key: string]: any;
}>;

export type OptionsType =
  | undefined
  | {
      formats?: Array<'woff2' | 'woff' | 'otf' | 'ttf' | 'eot'>;
      fileNameKey?: 'name' | 'fontFamily' | Array<string>;
      fileNameFormat?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
    };

export async function convertFont<T extends InputDataType>(designTokens: T, options: OptionsType) {
  try {
    const formats = options?.formats || ['woff2', 'woff'];

    const getFileName = (designToken: InputDataType[0]) => {
      let fileName: string;
      if (!options?.fileNameKey || typeof options.fileNameKey === 'string') {
        fileName = designToken[(options?.fileNameKey || 'name') as string];
      } else {
        fileName = options.fileNameKey
          .reduce<Array<string>>((acc, key) => {
            if (_.has(designToken, key) || _.has(designToken, `value[${key}]`)) {
              acc.push(_.get(designToken, key) || _.get(designToken, `value[${key}]`));
            }
            return acc;
          }, [])
          .join(' ');
      }
      return options?.fileNameFormat ? _[options.fileNameFormat](fileName) : fileName;
    };

    return (
      await Promise.all(
        designTokens.flatMap(async designToken => {
          const signedUrlsByFormat = await new Promise<PartialRecord<FontsFormat, string>>(
            resolve =>
              SpServices.font
                .convert({
                  postscriptName: designToken.value.fontPostScriptName,
                  formats,
                })
                .then(resolve)
                .catch(() => resolve({})),
          );

          return (Object.entries(signedUrlsByFormat) as Array<[FontsFormat, string]>).map(
            ([format, url]) => {
              return {
                ...designToken,
                value: {
                  ...designToken.value,
                  url,
                  format: format,
                  fileName: designToken?.value?.fileName || `${getFileName(designToken)}.${format}`,
                },
              };
            },
          );
        }),
      )
    ).flat(2);
  } catch (err) {
    throw err;
  }
}
