import { IToken, TokensType } from '../../types';
import { LibsType } from '../global-libs';
import prettier from 'prettier';
import os from 'os';
import * as _ from 'lodash';
import { ColorsFormat, TailwindTokenClass, TailwindType } from './to-tailwind.type';
import * as TokensClass from './tokens';

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
      formatName: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
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
    }>
  | undefined;

function getClassByType(type: string): TailwindTokenClass | undefined {
  const tokenClassName = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
  return (<any>TokensClass)[tokenClassName];
}

class ToTailwind {
  objectName;
  transformNameFn;
  exportDefault;
  module;
  tokensGroupByType;
  options;
  tokens;
  styles: Partial<Record<TailwindType, any>> = {};
  constructor(tokens: InputDataType, options: OptionsType) {
    this.options = options;
    this.objectName = options?.formatConfig?.objectName ?? 'theme';
    this.transformNameFn = _[options?.formatName ?? 'camelCase'];
    this.exportDefault = options?.formatConfig?.exportDefault ?? true;
    this.module = options?.formatConfig?.module ?? 'es6';
    this.tokens = tokens;
    this.tokensGroupByType = _.groupBy(tokens, 'type') as Record<TokensType, InputDataType>;
    this.styles = {};
  }
  exec() {
    const types = Object.keys(this.tokensGroupByType) as Array<TokensType>;
    types.forEach(type => Object.assign(this.styles, this.setGlobal(type)));
    const result = this.replaceFunctionTokens();
    return this.finalize(result);
  }

  setGlobal(type: TokensType) {
    const tokenHandler = getClassByType(type);
    if (!tokenHandler) return {};
    let tokenByType = this.tokensGroupByType[type].reduce((acc, token) => {
      const instance = new tokenHandler(token, this.transformNameFn);
      const tailwindTokens = instance.generate(this.options, this.tokens);
      (Object.keys(tailwindTokens) as Array<TailwindType>).forEach(tailwindKey => {
        acc[tailwindKey] = { ...(acc[tailwindKey] || {}), ...tailwindTokens[tailwindKey] };
      });
      return acc;
    }, this.styles as Record<TailwindType, any>);
    return tokenHandler.afterGenerate ? tokenHandler.afterGenerate(tokenByType) : tokenByType;
  }

  replaceFunctionTokens() {
    // List of keys that needs to be removed from the created styles before stringify
    // For example, backgroundImage sends back a function, not a string containing the function
    // So we need to remove it before adding it back
    const keysToExclude = Object.keys(this.tokensGroupByType).reduce(
      (keyToExclude: Array<TailwindType>, type) => {
        const tokenHandler = getClassByType(type);
        if (tokenHandler?.afterStringGenerate && tokenHandler.tailwindKeys)
          keyToExclude.push(...tokenHandler.tailwindKeys);
        return keyToExclude;
      },
      [],
    );
    // Stringify everything except for the keys
    const styles = JSON.stringify(_.omit(this.styles, keysToExclude));
    // After string generates add the specificities for our keys
    // From the example, it adds the function not stringified for backgroundImage
    return Object.keys(this.tokensGroupByType).reduce((result, type) => {
      const tokenHandler = getClassByType(type);
      if (tokenHandler?.afterStringGenerate)
        result = tokenHandler.afterStringGenerate(this.styles, result);
      return result;
    }, styles);
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
