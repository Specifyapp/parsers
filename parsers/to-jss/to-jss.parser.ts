import { Token } from '../../types';
import libs from '../global-libs';
import prettier from 'prettier';
import * as TokensClass from './tokens';

export type InputDataType = Array<Pick<Token, 'name' | 'value' | 'type'>>;
export type OutputDataType = Promise<string>;
export type ColorsFormat =
  | 'rgb'
  | 'prgb'
  | 'hex'
  | 'hex6'
  | 'hex3'
  | 'hex4'
  | 'hex8'
  | 'name'
  | 'hsl'
  | 'hsv';
export type BorderFormat = 'string' | 'array' | 'object';
export type DurationFormat = 'string' | 'number';
export type OpacityFormat = 'string' | 'number';
export type DepthFormat = 'string' | 'number';
export type MeasurementFormat = 'string' | 'number';
export type ShadowFormat = 'string' | 'array' | 'object';
export type GradientFormat = 'string' | 'array';
export type TextStyleFormat = 'string' | 'array' | 'object' | 'classObject';
export type FontSizeUnit = 'px' | 'pt';

export type FormatTokenType = Partial<{
  colorFormat: ColorsFormat;
  borderFormat: BorderFormat;
  durationFormat: DurationFormat;
  depthFormat: DepthFormat;
  shadowFormat: ShadowFormat;
  opacityFormat: OpacityFormat;
  measurementFormat: MeasurementFormat;
  gradientFormat: GradientFormat;
  textStyleFormat: TextStyleFormat;
  fontSizeUnit: FontSizeUnit;
}>
export type OptionsType =
  | Partial<{
      formatName: 'camelCase' | 'kebabCase' | 'snakeCase';
      formatTokens: FormatTokenType;
      formatConfig: Partial<{
        jssObjectName: string;
        endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
        tabWidth: number;
        useTabs: boolean;
        singleQuote: boolean;
        exportDefault: boolean;
      }>;
    }>
  | undefined;

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: typeof libs,
): OutputDataType {
  try {
    const transformNameFn = _[options?.formatName || 'camelCase'];
    const objectName = options?.formatConfig?.jssObjectName || 'theme';
    const isExported = options?.formatConfig?.exportDefault ?? true;

    const tokensGroupByType = _.groupBy(tokens, 'type');
    const styles = Object.keys(tokensGroupByType).reduce((result, type) => {
      const content = tokensGroupByType[type]
        .map((token: Pick<Token, 'value' | 'type' | 'name'>) => {
          if (!(<any>TokensClass)[`${token.type.charAt(0).toUpperCase() + token.type.slice(1)}`]) {
            return;
          }
          const instance = new (<any>TokensClass)[
            `${token.type.charAt(0).toUpperCase() + token.type.slice(1)}`
          ](token);

          const name =
            options?.formatName ||
            token.name.includes(' ') ||
            token.name.includes('\n') ||
            token.name.includes('/')
              ? transformNameFn(token.name)
              : token.name;
          return `'${name}': ${instance.toJss(options?.formatTokens || {})},`;
        })
        .join('');
      result += `${transformNameFn(type)}: {${content}},`;
      return result;
    }, '');

    return prettier.format(`const ${objectName} = {${styles}} ${isExported ? `;\n\nexport default ${objectName};` : ';'}`, {
      ...options?.formatConfig,
      parser: 'babel',
    });
  } catch (err) {
    throw err;
  }
}
