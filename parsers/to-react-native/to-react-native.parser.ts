import { BitmapToken, IToken, Token, VectorToken } from '../../types';
import prettier from 'prettier';
import * as TokensClass from './tokens';
import { LibsType } from '../global-libs';
import Template from '../../libs/template';
import { camelCase } from 'lodash';

export type InputDataType = Array<
  Pick<IToken, 'id' | 'name' | 'value' | 'type'> & Record<string, any>
>;
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

export type FormatTokenType = Partial<{}>;

export type OptionsType =
  | Partial<{
      assetsFolderPath?: string | { vector?: string; bitmap?: string };
      colorFormat: ColorsFormat;
      header: string;
      objectName: string;
      prettierConfig: prettier.Options;
    }>
  | undefined;

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  try {
    const objectName = options?.objectName || 'theme';
    const pattern =
      '{{name}}{{#dimension}}@{{dimension}}x{{/dimension}}{{#format}}.{{format}}{{/format}}';
    const tokensGroupByType = _.groupBy(tokens, 'type');
    const template = new Template(pattern);
    let imports = '';
    const styles = Object.keys(tokensGroupByType).reduce((result, type) => {
      const content = tokensGroupByType[type]
        .map((token: Pick<Token, 'value' | 'type' | 'name'>) => {
          const tokenClassName = `${token.type.charAt(0).toUpperCase() + token.type.slice(1)}`;

          if (!(<any>TokensClass)[tokenClassName]) return;

          token.name = camelCase(token.name);
          const instance = new (<any>TokensClass)[tokenClassName](token);

          if (token.type === 'vector' || token.type === 'bitmap') {
            if ((token as VectorToken | BitmapToken).meta.dimension !== 1) {
              return; // Do nothing with @2, @3 etc.
            }
            const fileName = template.render(token);
            const { theme, imports: tokenImports } = instance.toReactNative(options, fileName);
            imports += tokenImports;

            return `'${token.name}': ${theme},`;
          }

          return `'${token.name}': ${instance.toReactNative(options)},`;
        })
        .join('');

      if (content) {
        result += `${_.camelCase(type)}: {${content}},`;
      }
      return result;
    }, '');

    return prettier.format(
      (() => {
        return [
          options?.header || '',
          imports,
          `const ${objectName} = {${styles}};`,
          `export default ${objectName};`,
        ].join('\n');
      })(),
      {
        ...options?.prettierConfig,
        parser: 'babel',
      },
    );
  } catch (err) {
    throw err;
  }
}
