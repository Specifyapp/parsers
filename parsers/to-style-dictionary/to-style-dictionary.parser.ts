import prettier from 'prettier';
import { LibsType } from '../global-libs';
import { ColorsFormat, DownloadableFile, IToken, TokensType } from '../../types';
import {
  BaseStyleDictionaryTokensFormat,
  StyleDictionaryTokenClass,
} from './to-style-dictionary.type';
import * as TokensClass from './tokens';
import deepmerge from 'deepmerge';
import '../../types/utils/utils';

export type OutputDataType = Array<DownloadableFile>;
export type InputDataType = Array<
  Pick<IToken, 'id' | 'name' | 'value' | 'type'> & Record<string, any>
>;
export type FormatTokenType = Partial<{
  colorFormat: {
    format: ColorsFormat;
  };
  fontSizeFormat: {
    unit: 'px' | 'rem' | 'none';
  };
  fontFormat: Array<'woff2' | 'woff' | 'otf' | 'ttf' | 'eot'>;
  timeAsIntegers: boolean;
}>;
export type OptionsType =
  | Partial<{
      formatName: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
      formatTokens: FormatTokenType;
      splitBy?: string;
      assetsBaseDirectory?: Partial<{
        fonts?: string;
        images?: string;
        icons?: string;
      }>;
      formatConfig?: Partial<{
        endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
        tabWidth: number;
        useTabs: boolean;
      }>;
    }>
  | undefined;

function getClassByType(type: string): StyleDictionaryTokenClass | undefined {
  const tokenClassName = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
  return (<any>TokensClass)[tokenClassName];
}

export default async function (
  tokens: InputDataType,
  options: OptionsType = {},
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  const transformNameFn = _[options?.formatName ?? 'camelCase'];
  const tokensGroupByType = _.groupBy(tokens, 'type');
  // loop over specify types
  const data = Object.keys(tokensGroupByType).reduce<BaseStyleDictionaryTokensFormat>(
    (result, type) => {
      // loop over design tokens of one specify type
      const styleDictionaryTokens = Object.values(tokensGroupByType[type]).reduce(
        (acc, designDecision) => {
          const tokenHandler = getClassByType(type as TokensType);
          if (!tokenHandler) return {};
          const keys = options?.splitBy
            ? designDecision.name!.split(options.splitBy)
            : [designDecision.name];
          const instance = new tokenHandler(
            designDecision,
            keys.map(k => transformNameFn(k)),
          );
          return deepmerge(instance.generate(options), acc);
        },
        {},
      );
      return deepmerge(result, styleDictionaryTokens);
    },
    {},
  );

  return Object.entries(data).reduce<Array<DownloadableFile>>((acc, [type, value]) => {
    if (type === 'measurement') type = 'size';
    return acc.concat(
      ...Object.entries(value!).reduce<Array<DownloadableFile>>((files, [fileName, content]) => {
        return [
          ...files,
          {
            name: `${type}/${fileName === type ? 'base' : fileName}.json`,
            value: {
              content: prettier.format(
                JSON.stringify({
                  [type]: {
                    [fileName]: content,
                  },
                }),
                {
                  parser: 'json',
                  ...options.formatConfig,
                },
              ),
            },
          },
        ];
      }, []),
    );
  }, []);
}
