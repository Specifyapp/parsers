import { AllowedFormat } from '../../types';
import type { LibsType } from '../global-libs';
import { PartialRecord } from '../../types';

export type InputDataType = Array<{
  value: {
    fontPostScriptName: string;
    fontFamily?: string;
    fontWeight?: string | number;
    [Key: string]: any;
  };
  [Key: string]: any;
}>;
export type OutputDataType =
  | Array<InputDataType[0] & { value: InputDataType[0]['value'] & { url: string } }>
  | Error;
export type OptionsType = {
  formats?: Array<'woff2' | 'woff' | 'otf' | 'ttf' | 'eot'>;
  fileNameKey?: 'name' | 'fontFamily' | Array<string>;
  fileNameFormat?: 'camelCase' | 'kebabCase' | 'snakeCase';
};

export default async function (
  designTokens: InputDataType,
  options: OptionsType | undefined,
  { _, SpServices }: LibsType,
): Promise<OutputDataType> {
  try {
    const formats = options?.formats || ['woff2', 'woff', 'otf', 'ttf', 'eot'];

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
          const signedUrlsByFormat = await new Promise<PartialRecord<AllowedFormat, string>>(
            resolve =>
              SpServices.font
                .convert({
                  postscriptName: designToken.value.fontPostScriptName,
                  formats,
                })
                .then(resolve)
                .catch(() => resolve({})),
          );

          return (Object.entries(signedUrlsByFormat) as Array<[AllowedFormat, string]>).map(
            ([format, url]) => {
              return {
                ...designToken,
                value: { ...designToken.value, url },
                name: `${getFileName(designToken)}.${format}`,
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
