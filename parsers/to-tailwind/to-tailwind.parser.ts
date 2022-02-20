import { IToken, PartialRecord, TokensType } from '../../types';
import { LibsType } from '../global-libs';
import prettier from 'prettier';
import os from 'os';
import * as _ from 'lodash';
import { ColorsFormat, FormatName, TailwindTokenClass, TailwindType } from './to-tailwind.type';
import * as TokensClass from './tokens';
import deepmerge from 'deepmerge';

export type OutputDataType = string;
export type InputDataType = Array<
  Pick<IToken, 'id' | 'name' | 'value' | 'type'> & Record<string, any>
>;
export type FormatTokenType = Partial<{
  colorFormat: {
    format: ColorsFormat;
  };
  fontSizeFormat: {
    unit: 'px' | 'rem';
  };
}>;
export type OptionsType =
  | Partial<{
      formatName: FormatName;
      formatTokens: FormatTokenType;
      formatConfig: Partial<{
        module: 'es6' | 'commonjs';
        objectName: string;
        endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
        tabWidth: number;
        useTabs: boolean;
        singleQuote: boolean;
        exportDefault: boolean;
      }>;
      renameKeys: PartialRecord<TailwindType, string>;
      splitBy?: string;
    }>
  | undefined;

function getClassByType(type: string): TailwindTokenClass | undefined {
  const tokenClassName = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
  return (<any>TokensClass)[tokenClassName];
}

class ToTailwind {
  objectName;
  exportDefault;
  module;
  tokensGroupedByType;
  options;
  tokens;
  styles: Partial<Record<TailwindType, any>> = {};
  constructor(tokens: InputDataType, options: OptionsType) {
    this.options = options;
    this.objectName = options?.formatConfig?.objectName ?? 'theme';
    this.exportDefault = options?.formatConfig?.exportDefault ?? true;
    this.module = options?.formatConfig?.module ?? 'es6';
    this.tokens = tokens;
    this.tokensGroupedByType = _.groupBy(tokens, 'type');
    this.styles = {};
  }
  exec() {
    const tokenTypes = Object.keys(this.tokensGroupedByType) as Array<TokensType>;
    this.styles = tokenTypes.reduce(
      (acc, tokenType) => ({ ...acc, ...this.setGlobal(tokenType) }),
      {},
    );
    return this.finalize(JSON.stringify(this.styles));
  }

  setGlobal(tokenType: TokensType) {
    const TokenHandler = getClassByType(tokenType);
    if (!TokenHandler) return {};

    const tokenByType = this.tokensGroupedByType[tokenType].reduce((acc, token) => {
      const instance = new TokenHandler(token);
      const tailwindTokens = instance.generate(this.options, this.tokens);
      return deepmerge(acc, tailwindTokens);
    }, {});

    return TokenHandler.afterGenerate ? TokenHandler.afterGenerate(tokenByType) : tokenByType;
  }

  finalize(result: string) {
    return prettier.format(
      (() => {
        if (this.module === 'es6' && this.exportDefault)
          return `const ${this.objectName} = ${result} ${`;${os.EOL + os.EOL}export default ${
            this.objectName
          };`}`;
        else if (this.module === 'es6' && !this.exportDefault)
          return `export const ${this.objectName} = ${result};`;
        else if (this.module === 'commonjs' && this.exportDefault)
          return `const ${this.objectName} = ${result}; ${`${os.EOL + os.EOL}module.exports = ${
            this.objectName
          };`}`;
        else
          return `const ${this.objectName} = ${result}; ${`${os.EOL + os.EOL}module.exports = {${
            this.objectName
          }};`}`;
      })(),
      {
        ...this.options?.formatConfig,
        parser: 'babel',
      },
    );
  }
}

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  try {
    const parserInstance = new ToTailwind(tokens, options);
    return parserInstance.exec();
  } catch (err) {
    throw err;
  }
}
