import { Token } from '../../types';
import prettier from 'prettier';
import * as TokensClass from './tokens';
import { LibsType } from '../global-libs';

export type InputDataType = Array<Pick<Token, 'name' | 'value' | 'type'>>;
export type OutputDataType = string;
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
}>;
export type OptionsType =
  | Partial<{
      formatName: 'camelCase' | 'kebabCase' | 'snakeCase';
      formatTokens: FormatTokenType;
      formatConfig: Partial<{
        module: 'es6' | 'commonjs';
        jssObjectName: string;
        endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
        tabWidth: number;
        useTabs: boolean;
        singleQuote: boolean;
        exportDefault: boolean;
        isVectorFileType: boolean;
        isBitmapFileType: boolean;
        isBitmapScale: boolean;
      }>;
    }>
  | undefined;

const formatName = (name: string, isScale: boolean, isFileType: boolean) => {
  const start = name.substring(0, name.lastIndexOf(isScale ? '.' : '@'));
  const end = name.substring(name.lastIndexOf(isFileType ? '.' : ''), name.length);
  return start.concat(end);
}

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  try {
    const transformNameFn = _[options?.formatName || 'camelCase'];
    const objectName = options?.formatConfig?.jssObjectName || 'theme';
    const exportDefault = options?.formatConfig?.exportDefault ?? true;
    const module = options?.formatConfig?.module ?? 'es6';
    const isVectorFiletype = options?.formatConfig?.isVectorFileType ?? true;
    const isBitmapFiletype = options?.formatConfig?.isBitmapFileType ?? true;
    const isBitmapScale = options?.formatConfig?.isBitmapScale ?? true;

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

          const customNames: Record<string, string> = {
            vector: formatName(token.name, true, isVectorFiletype),
            bitmap: formatName(token.name, isBitmapScale, isBitmapFiletype),
          }

          const tokenName = customNames[token.type] || token.name;

          const name =
            options?.formatName ||
            tokenName.includes(' ') ||
            tokenName.includes('\n') ||
            tokenName.includes('/')
              ? transformNameFn(tokenName)
              : tokenName;
          return `'${name}': ${instance.toJss(options?.formatTokens || {})},`;
        })
        .join('');
      result += `${transformNameFn(type)}: {${content}},`;
      return result;
    }, '');

    return prettier.format(
      (() => {
        if (module === 'es6' && exportDefault)
          return `const ${objectName} = {${styles}} ${`;\n\nexport default ${objectName};`}`;
        else if (module === 'es6' && !exportDefault)
          return `export const ${objectName} = {${styles}};`;
        else if (module === 'commonjs' && exportDefault)
          return `const ${objectName} = {${styles}}; ${`\n\nmodule.exports = ${objectName};`}`;
        else return `const ${objectName} = {${styles}}; ${`\n\nmodule.exports = {${objectName}};`}`;
      })(),
      {
        ...options?.formatConfig,
        parser: 'babel',
      },
    );
  } catch (err) {
    throw err;
  }
}
