import { Token, TokenType } from '@specifyapp/types';
import { defaultLibraryType } from '../global-libs';
import { is } from 'typescript-is';
import { getTypeExpectation } from '@specifyapp/get-expectation';
import prettier from 'prettier/standalone';
import parserCss from 'prettier/parser-postcss';
import * as TokensClass from './tokens';

type outputType = Promise<string | Error>;

export type ParserContext = {
  tokens: Array<Pick<Token, 'name' | 'value' | 'type'>>;
  options: null | {
    formatName?: 'camelCase' | 'kebabCase' | 'snakeCase';
    formatTokens?: {
      color?: 'rgb' | 'prgb' | 'hex' | 'hex6' | 'hex3' | 'hex4' | 'hex8' | 'name' | 'hsl' | 'hsv';
    };
    formatConfig?: {
      endOfLine?: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth?: number;
      useTabs?: boolean;
    };
  };
};

const parserName: string = 'to-css';

export default async function (
  tokens: ParserContext['tokens'],
  options: ParserContext['options'],
  { _ }: defaultLibraryType,
): outputType {
  try {
    // if (!is<ParserContext['tokens']>(tokens)) {
    //   return Promise.reject({
    //     parser: parserName,
    //     message: 'Bad input value: tokens',
    //     actual: tokens,
    //     expected: getTypeExpectation<ParserContext['tokens']>(),
    //   });
    // }
    // if (options && !is<ParserContext['options']>(options)) {
    //   return Promise.reject({
    //     parser: parserName,
    //     message: 'Bad input value: options',
    //     actual: options,
    //     expected: getTypeExpectation<ParserContext['options']>(),
    //   });
    // }

    const transformNameFn = _[options?.formatName || 'kebabCase'];
    const tokensGroupByType = _.groupBy(tokens, 'type');
    const styles = Object.keys(tokensGroupByType).reduce((result: string, type: TokenType) => {
      result += `\n\n/* ${type.toUpperCase()} */\n`;
      result += tokensGroupByType[type]
        .map((token: Token): string => {
          if (!(<any>TokensClass)[`${token.type.charAt(0).toUpperCase() + token.type.slice(1)}`])
            return;
          const instance = Object.assign(
            new (<any>TokensClass)[`${token.type.charAt(0).toUpperCase() + token.type.slice(1)}`](),
            token,
          );
          const name = token.name.includes(' ') ? transformNameFn(token.name) : token.name;
          return `--${name}: ${instance.toCss(options)};`;
        })
        .join('');
      return result;
    }, '');

    return prettier.format(`:root {${styles}}`, {
      ...options?.formatConfig,
      parser: 'css',
      plugins: [parserCss],
    });
  } catch (e) {
    return e;
  }
}
