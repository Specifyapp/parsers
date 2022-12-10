import * as _ from 'lodash';
import { parseStringPromise } from 'xml2js';
import { create } from 'xmlbuilder2';
import color from 'tinycolor2';
import { ColorValue, IToken, TokensType } from '../../types';
import { LibsType } from '../global-libs';
import { xml2jsElementType } from '../../types';

export type InputDataType = Array<
  IToken & {
    name: string;
    type: TokensType;
    value: ({ url?: string } | { content?: string }) & { [key: string]: any };
  }
>;

export type OutputDataType = InputDataType;

type format = 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase' | 'none';
const DEFAULT_FORMAT: format = 'kebabCase';

export type OptionsType =
  | undefined
  | {
      cssVariablesFormat: format;
    };

type SvgNode = {
  '@fill'?: string;
  '@stroke'?: string;
  '#'?: { [k: string]: SvgNode }[];
};

const applyFormat = (str: string, fn?: format) => {
  if (fn && fn !== 'none') return _[fn](str);
  return str.includes(' ') || str.includes('\n') || str.includes('/') ? JSON.stringify(str) : str;
};

type TokenColor = {
  cssVar: string;
  color: ColorValue;
};

const getColor = (attr: string, colors: TokenColor[]) => {
  const attrColor = color(attr).toRgb();

  return colors.find(
    ({ color }) =>
      color.a === attrColor.a &&
      color.r === attrColor.r &&
      color.g === attrColor.g &&
      color.b === attrColor.b,
  );
};

const updateNodesColors = (svgNode: SvgNode, colors: TokenColor[]): SvgNode => ({
  ...svgNode,
  ...(() => {
    const result: { '@fill'?: string; '@stroke'?: string } = {};

    if (!!svgNode['@fill'] && svgNode['@fill'] !== 'none') {
      const fill = getColor(svgNode['@fill'], colors);

      if (!!fill) result['@fill'] = fill.cssVar;
    }

    if (!!svgNode['@stroke'] && svgNode['@stroke'] !== 'none') {
      const stroke = getColor(svgNode['@stroke'], colors);

      if (!!stroke) result['@stroke'] = stroke.cssVar;
    }

    return result;
  })(),

  '#': svgNode['#']?.map(nodes => {
    const newNodes: { [k: string]: SvgNode } = {};

    for (const key in nodes) {
      newNodes[key] = updateNodesColors(nodes[key], colors);
    }

    return newNodes;
  }),
});

const formatAttribute4XMLBuilder = (attrName: string) => `@${attrName}`;

const formatObject4XMLBuilder = (_xpath: string, _: never, element: xml2jsElementType) => {
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
};

export default async function svgWithCssVariables(
  tokens: InputDataType,
  options: OptionsType,
  { SpServices }: Pick<LibsType, 'SpServices'>,
): Promise<OutputDataType | Error> {
  const colors = tokens
    .filter(({ type }) => type === 'color')
    .map(color => ({
      cssVar: `var(--${applyFormat(color.name, options?.cssVariablesFormat ?? DEFAULT_FORMAT)})`,
      color: color.value as ColorValue,
    }));

  return Promise.all(
    tokens.map(async token => {
      const { type, value } = token;

      if (type !== 'vector' || value.format !== 'svg') return token;

      if (token.value.url && !token.value.content) {
        token.value.content = await SpServices.assets.getSource<string>(token.value.url!, 'text');
      }

      const xmlObject: { svg: SvgNode } = await parseStringPromise(token.value.content, {
        explicitArray: true,
        explicitChildren: true,
        explicitRoot: false,
        mergeAttrs: false,
        normalize: true,
        normalizeTags: false,
        preserveChildrenOrder: true,
        attrNameProcessors: [formatAttribute4XMLBuilder],
        validator: formatObject4XMLBuilder,
      });

      return {
        ...token,
        value: {
          ...token.value,
          content: create({ svg: updateNodesColors(xmlObject.svg, colors) })
            .end({
              headless: true,
              prettyPrint: false,
              indent: '\t',
              newline: '\n',
            })
            .replace(/&quot;/g, '\\"'),
        },
      };
    }),
  );
}
