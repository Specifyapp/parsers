import { IToken } from '../../types';
import prettier from 'prettier/standalone';
import parserCss from 'prettier/parser-postcss';
import * as TokensClass from './tokens';
import * as _ from 'lodash';

export type InputDataType = Array<Pick<IToken, 'name' | 'value' | 'type'> & Record<string, any>>;
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
export type OptionsType =
  | Partial<{
      formatName: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
      formatTokens: Partial<{
        color: ColorsFormat;
      }>;
      formatConfig: Partial<{
        selector: string;
        endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
        tabWidth: number;
        useTabs: boolean;
      }>;
    }>
  | undefined;

export default async function toCssCustomProperties<T extends InputDataType>(
  tokens: T,
  options?: OptionsType,
) {
  try {
    const transformNameFn = _[options?.formatName || 'kebabCase'];
    const selector = options?.formatConfig?.selector || ':root';
    const tokensGroupByType = _.groupBy(tokens, 'type');
    const styles = Object.keys(tokensGroupByType).reduce((result, type) => {
      const formatedCss = tokensGroupByType[type]
        .map(token => {
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
          return `--${name}: ${instance.toCss(options)};`;
        })
        .join('');
      if (formatedCss.length > 0) result += `\n\n/* ${type.toUpperCase()} */\n${formatedCss}`;
      return result;
    }, '');
    return prettier.format(`${selector} {${styles}}`, {
      ...options?.formatConfig,
      parser: 'css',
      plugins: [parserCss],
    });
  } catch (err) {
    throw err;
  }
}
