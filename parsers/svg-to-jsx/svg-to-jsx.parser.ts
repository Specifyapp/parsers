import { LibsType } from '../global-libs';
import Template from '../../libs/template';
import prettier from 'prettier';
import { IToken, TokensType } from '../../types';
import * as os from 'os';

export type InputDataType = Array<
  IToken & {
    name: string;
    type: TokensType;
    value: ({ url?: string } | { content?: string }) & { [key: string]: any };
  }
>;

export type OutputDataType = Array<
  InputDataType[0] & { value: { content: string; fileName: string; [key: string]: any } }
>;

export type OptionsType =
  | undefined
  | {
      prepend?: string; // import React from 'react';
      variableFormat?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase'; // default: pascalCase
      formatConfig?: Partial<{
        exportDefault: boolean;
        endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
        tabWidth: number;
        useTabs: boolean;
        singleQuote: boolean;
      }>;
      wrapper?: {
        tag: string;
        className?: string;
      };
    };

const templateExportDefaultModel = `export {{#options.formatConfig.exportDefault}}default{{/options.formatConfig.exportDefault}}{{^options.formatConfig.exportDefault}}const {{variableName}} ={{/options.formatConfig.exportDefault}} () => (
  {{#options.wrapper.tag}}<{{options.wrapper.tag}} {{#className}}className="{{className}}"{{/className}} >{{/options.wrapper.tag}}
  {{token.value.content}}
  {{#options.wrapper.tag}}</{{options.wrapper.tag}}>{{/options.wrapper.tag}}
)`;

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _, SpServices }: Pick<LibsType, '_' | 'SpServices'>,
): Promise<OutputDataType> {
  try {
    const template = new Template(templateExportDefaultModel);
    const classNameTemplate = options?.wrapper?.className
      ? new Template(options.wrapper.className)
      : null;

    options = {
      formatConfig: {
        exportDefault: true,
        ...(options?.formatConfig || {}),
      },
      ...(options || {}),
    };

    return await Promise.all(
      tokens
        // This parser only works on svg, not pdf
        .filter(({ value, type }) => type === 'vector' && value.format === 'svg')
        .map(async (token): Promise<OutputDataType[0]> => {
          if (token.value.url && !token.value.content) {
            token.value.content = await SpServices.assets.getSource<string>(
              token.value.url!,
              'text',
            );
          }
          const className = classNameTemplate?.render(token);
          const variableName = _[options?.variableFormat || 'pascalCase'](token.name);

          token.value.content = prettier.format(
            (options?.prepend ? `${options?.prepend}${os.EOL}${os.EOL}` : '') +
              template.render({ token, variableName, options, className }),
            {
              parser: 'babel',
              ...(options?.formatConfig
                ? _.pick(options.formatConfig, ['endOfLine', 'tabWidth', 'useTabs', 'singleQuote'])
                : {}),
            },
          );
          token.value.fileName = token.value.fileName
            ? token.value.fileName
            : `${_.camelCase(token.name)}.jsx`;
          return { ...token, value: _.omit(token.value, ['url']) } as OutputDataType[0];
        }),
    );
  } catch (err) {
    throw err;
  }
}
