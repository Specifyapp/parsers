import * as _ from 'lodash';
import Template from '../../libs/template';
import prettier from 'prettier';
import { Token, TokensType } from '../../types';
import * as os from 'os';
import { create } from 'xmlbuilder2';
import { parseStringPromise } from 'xml2js';
import { xml2jsElementType } from './svg-to-jsx.type';
import { ExpandObject } from 'xmlbuilder2/lib/interfaces';
import { SpServices } from '../global-libs';

export type InputDataType = Array<
  Token & {
    name: string;
    type: TokensType;
    value: ({ url?: string } | { content?: string }) & { [key: string]: any };
  }
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
        isTsx: boolean;
      }>;
      wrapper?: {
        tag: string;
        className?: string;
      };
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

function convertStyleAttrAsJsxObject(content: string) {
  return content.replace(/style="([^"\\]*)"/, function (styleAttr: string, styleContent: string) {
    const style = styleContent
      .split(/\s*;\s*/g)
      .filter(Boolean)
      .reduce(function (hash: Record<string, string>, rule: string) {
        const keyValue: string[] = rule.split(/\s*:\s*(.*)/);
        hash[_.camelCase(keyValue[0])] = keyValue[1];
        return hash;
      }, {});
    //JSX style must be in json object format surrounded by curly braces
    return `style={${JSON.stringify(style)}}`;
  });
}

const templateExportDefaultModel = `export {{#options.formatConfig.exportDefault}}default{{/options.formatConfig.exportDefault}}{{^options.formatConfig.exportDefault}}const {{variableName}} ={{/options.formatConfig.exportDefault}} () => (
  {{#options.wrapper.tag}}<{{options.wrapper.tag}} {{#className}}className="{{className}}"{{/className}} >{{/options.wrapper.tag}}
  {{token.value.content}}
  {{#options.wrapper.tag}}</{{options.wrapper.tag}}>{{/options.wrapper.tag}}
)`;

export async function svgToJsx<T extends InputDataType>(tokens: T, options: OptionsType) {
  try {
    const template = new Template(templateExportDefaultModel);
    const classNameTemplate = options?.wrapper?.className
      ? new Template(options.wrapper.className)
      : null;

    options = {
      formatConfig: {
        exportDefault: !options?.variableFormat,
        ...(options?.formatConfig || {}),
      },
      ...(options || {}),
    };

    return await Promise.all(
      tokens
        // This parser only works on svg, not pdf
        .filter(({ value, type }) => type === 'vector' && value.format === 'svg')
        .map(async (token): Promise<unknown> => {
          if (token.value.url && !token.value.content) {
            token.value.content = await SpServices.assets.getSource<string>(
              token.value.url!,
              'text',
            );
          }
          const className = classNameTemplate?.render(token);
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
            validator: formatObject4XMLBuilder,
          });

          token.value.content = convertObjectToXMLString(xmlObject);
          token.value.content = convertStyleAttrAsJsxObject(token.value.content);

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
            : `${_.camelCase(token.name)}.${options?.formatConfig?.isTsx ? 'tsx' : 'jsx'}`;
          return { ...token, value: _.omit(token.value, ['url']) };
        }),
    );
  } catch (err) {
    throw err;
  }
}
