import { Token } from '../../types';
import libs from '../global-libs';
import prettier from 'prettier/standalone';
import parserCss from 'prettier/parser-postcss';
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
export type OptionsType =
  | Partial<{
      formatName: 'camelCase' | 'kebabCase' | 'snakeCase';
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

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: typeof libs,
): OutputDataType {
  try {
    const transformNameFn = _[options?.formatName || 'kebabCase'];
    const selector = options?.formatConfig?.selector || ':root';
    const tokensGroupByType = _.groupBy(tokens, 'type');
    const styles = Object.keys(tokensGroupByType).reduce((result, type) => {
      result += `\n\n/* ${type.toUpperCase()} */\n`;
      result += tokensGroupByType[type]
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
          return `--${name}: ${instance.toCss(options)};`;
        })
        .join('');
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
