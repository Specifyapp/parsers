import * as _ from 'lodash';
import { LibsType } from '../global-libs';
import Template from '../../libs/template';
import prettier from 'prettier';
import { IToken, TokensType } from '../../types';
import { create } from 'xmlbuilder2';
import { parseStringPromise } from 'xml2js';
import { xml2jsElementType } from './svg-to-tailwind.type';
import { ExpandObject } from 'xmlbuilder2/lib/interfaces';

const SvgContainer = 'SvgContainer';

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
      variableFormat?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase'; // default: pascalCase
      formatConfig?: Partial<{
        endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
        tabWidth: number;
        useTabs: boolean;
        singleQuote: boolean;
      }>;
    };

function formatObject4XMLBuilder(xpath: string, _: never, element: xml2jsElementType) {
  const tag = element['#name'];
  let value = element._;
  if (!value && element.$$) {
    value = { '#': element.$$ };
  }
  if (element.$) {
    value = { ...value, ...element.$ };
  }

  if (tag === SvgContainer) {
    const updatedValue = {
      ...value,
      '@color': '{color}',
      '@className': '{className}',
    };

    return { [tag]: updatedValue };
  }

  return {
    [tag]: value,
  };
}

function convertObjectToXMLString(xmlObject: ExpandObject) {
  return create(xmlObject).end({ headless: true, prettyPrint: false, indent: '\t', newline: '\n' });
}

function camelCaseAttribute(attrName: string) {
  const specificAttributeToConvert: Record<string, string> = {
    viewbox: 'viewBox',
    maskunits: 'maskUnits',
    gradientunits: 'gradientUnits',
    gradienttransform: 'gradientTransform',
  };
  attrName = attrName.toLowerCase();
  // attribute for xmlBuilder must start with '@'
  if (specificAttributeToConvert[attrName]) {
    return `@${specificAttributeToConvert[attrName]}`;
  }

  return attrName.startsWith('data-') || attrName.startsWith('aria-')
    ? `@${attrName}`
    : '@' + _.camelCase(attrName);
}

function convertAttrsToProps(content: string) {
  content = content.replace(/width="{width}"/, 'width={width}');
  content = content.replace(/height="{height}"/, 'height={height}');
  content = content.replace(/className="{className}"/, 'className={className}');
  content = content.replace(/color="{color}"/, 'color={color}');

  return content;
}

function convertToProps(value: string, name: string) {
  if (name === 'fill' && value === 'none') return value;

  const specificAttributeToConvert: Record<string, string> = {
    width: '{width}',
    height: '{height}',
    color: '{color}',
    className: '{className}',
    fill: 'currentColor',
  };

  if (specificAttributeToConvert[name]) {
    return specificAttributeToConvert[name];
  }

  return value;
}

function convertToStyledComponent(value: string) {
  if (value === 'svg') return SvgContainer;

  return value;
}

const templateDefaultModel = `const {{variableName}}: React.FC<Client.SVG.SvgProps> = ({
  width,
  height,
  className,
  color,
}) => (
  {{token.value.content}}
);

export default {{variableName}};`;

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { SpServices }: Pick<LibsType, 'SpServices'>,
): Promise<OutputDataType | Error> {
  try {
    const template = new Template(templateDefaultModel);

    options = {
      formatConfig: {
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

          const variableName = _[options?.variableFormat || 'pascalCase'](token.name);

          const xmlObject = await parseStringPromise(token.value.content, {
            explicitArray: true,
            explicitChildren: true,
            explicitRoot: false,
            mergeAttrs: false,
            normalize: true,
            normalizeTags: false,
            preserveChildrenOrder: true,
            attrNameProcessors: [camelCaseAttribute],
            attrValueProcessors: [convertToProps],
            tagNameProcessors: [convertToStyledComponent],
            validator: formatObject4XMLBuilder,
          });

          token.value.content = convertObjectToXMLString(xmlObject);
          token.value.content = convertAttrsToProps(token.value.content);

          token.value.content = prettier.format(
            `import React from 'react';
              import tw, { styled } from 'twin.macro';

              const SvgContainer = styled.svg\`
              \${tw\`fill-current\`}
              \${({ color }) => (color != null ? \`color: \${color};\` : null)}
            \`;

            ` + template.render({ token, variableName, options }),
            {
              parser: 'babel',
              ...(options?.formatConfig
                ? _.pick(options.formatConfig, ['endOfLine', 'tabWidth', 'useTabs', 'singleQuote'])
                : {}),
            },
          );
          token.value.fileName = token.value.fileName
            ? token.value.fileName
            : `${_.camelCase(token.name)}.tsx`;
          return { ...token, value: _.omit(token.value, ['url']) } as OutputDataType[0];
        }),
    );
  } catch (err) {
    throw err;
  }
}
