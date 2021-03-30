import { Token } from '../../types';
import prettier from 'prettier';
import * as TokensClass from './tokens';
import { LibsType } from '../global-libs';
import Template from '../../libs/template';

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

export type FormatConfigType = Partial<{
  module: 'es6' | 'commonjs';
  jssObjectName: string;
  endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
  tabWidth: number;
  useTabs: boolean;
  singleQuote: boolean;
  exportDefault: boolean;
  assetsFolderPath?: string | { vector?: string; bitmap?: string };
  assetsFilePattern?: string;
}>;

export type OptionsType =
  | Partial<{
      formatName: 'camelCase' | 'kebabCase' | 'snakeCase';
      formatTokens: FormatTokenType;
      formatConfig: FormatConfigType;
    }>
  | undefined;

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
    const pattern =
      options?.formatConfig?.assetsFilePattern ??
      '{{name}}{{#dimension}}@{{dimension}}x{{/dimension}}{{#format}}.{{format}}{{/format}}';
    const tokensGroupByType = _.groupBy(tokens, 'type');
    const template = new Template(pattern);
    const styles = Object.keys(tokensGroupByType).reduce((result, type) => {
      const content = tokensGroupByType[type]
        .map((token: Pick<Token, 'value' | 'type' | 'name'>) => {
          const tokenClassName = `${token.type.charAt(0).toUpperCase() + token.type.slice(1)}`;

          if (!(<any>TokensClass)[tokenClassName]) return;
          const instance = new (<any>TokensClass)[tokenClassName](token);

          token.name =
            options?.formatName ||
            token.name.includes(' ') ||
            token.name.includes('\n') ||
            token.name.includes('/')
              ? transformNameFn(token.name)
              : token.name;

          const fileName =
            token.type === 'vector' || token.type === 'bitmap' ? template.render(token) : null;
          return `'${token.name}': ${instance.toJss(
            { ...options?.formatTokens },
            { ...options?.formatConfig },
            fileName,
          )},`;
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
