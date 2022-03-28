import * as _ from 'lodash';
import prettier from 'prettier';
import * as os from 'os';
import {
  BitmapToken,
  BorderToken,
  ColorToken,
  DepthToken,
  DesignTokensType,
  DownloadableFile,
  DurationToken,
  FontToken,
  GradientToken,
  MeasurementToken,
  OpacityToken,
  PartialRecord,
  ShadowToken,
  TextStyleToken,
  Token,
  TokensType,
  VectorToken,
} from '../../types';
import TokensHandler from './tokens';
import { ColorsFormat, ScssMapHandlerType, ToScssMapTokenType } from './to-scss-map.type';
import Template from '../../libs/template';

export type InputDataType = Array<
  | Pick<ColorToken, 'value' | 'type' | 'name'>
  | Pick<BorderToken, 'value' | 'type' | 'name'>
  | Pick<DepthToken, 'value' | 'type' | 'name'>
  | Pick<DurationToken, 'value' | 'type' | 'name'>
  | Pick<GradientToken, 'value' | 'type' | 'name'>
  | Pick<MeasurementToken, 'value' | 'type' | 'name'>
  | Pick<OpacityToken, 'value' | 'type' | 'name'>
  | Pick<ShadowToken, 'value' | 'type' | 'name'>
  | Pick<VectorToken, 'value' | 'type' | 'name'>
  | Pick<BitmapToken, 'value' | 'type' | 'name'>
  | Pick<FontToken, 'value' | 'type' | 'name'>
  | Pick<TextStyleToken, 'value' | 'type' | 'name'>
  | Record<string, any>
>;

export type FormatTokenType = Partial<{
  color: {
    format: ColorsFormat;
  };
  fontSize: {
    unit?: 'px' | 'rem';
  };
}>;
export type OptionsType =
  | undefined
  | {
      variableName?: string | PartialRecord<ToScssMapTokenType, string>; // pattern or mapped pattern by token type
      fileName?: string | PartialRecord<ToScssMapTokenType, string>; // pattern or mapped pattern by token type
      formatTokens?: FormatTokenType;
      formatName?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
      // regex use a regex to match selector used for nesting
      /* ex:
       * tokens : [{name: 'color-light-primary', value: '#000000' }]
       * splitBy: '-'
       * result: $color: (
          color: (
            light: (
              primary: #000000
            )
          )
        )
       */
      splitBy?: string;
      formatConfig?: Partial<{
        endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
        tabWidth: number;
        useTabs: boolean;
        singleQuote: boolean;
      }>;
      omitFunctionAndMixin?: boolean;
      functionName?: string | PartialRecord<ToScssMapTokenType, string>;
      mixinName?: string | PartialRecord<ToScssMapTokenType, string>;
    };

export const TYPES_USING_FUNCTION = [
  'color',
  'measurement',
  'shadow',
  'border',
  'depth',
  'duration',
  'opacity',
  'gradient',
  'borderRadius',
] as Array<ToScssMapTokenType>;
export const TYPES_USING_MIXIN = ['textStyle'] as Array<ToScssMapTokenType>;

const generateVariableName = (
  interpolableData: Record<string, any>,
  handler: ScssMapHandlerType,
  options: OptionsType,
) => {
  return (
    generateName(interpolableData, handler, options, 'variableName') ||
    `$${_.kebabCase(handler.name)}`
  );
};

const generateFileName = (
  interpolableData: Record<string, any>,
  handler: ScssMapHandlerType,
  options: OptionsType,
) => {
  return generateName(interpolableData, handler, options, 'fileName') || _.kebabCase(handler.name);
};

const generateName = (
  interpolableData: Record<string, any>,
  handler: ScssMapHandlerType,
  options: OptionsType = {},
  key: 'variableName' | 'fileName' | 'mixinName' | 'functionName',
) => {
  let result = '';

  if (key in options && typeof options[key] === 'object') {
    const template = new Template(
      (options[key] as PartialRecord<ToScssMapTokenType, string>)[handler.name] as string,
    );
    result = template.render({ ...handler, ...interpolableData });
  } else if (key in options) {
    const template = new Template(options[key] as string);
    result = template.render({ ...handler, ...interpolableData });
  }

  const mustAddDollar = result && result.charAt(0) !== '$' && key === 'variableName';

  return mustAddDollar ? `$${result}` : result;
};

const getSCSS = (chunk: object | string | number): string => {
  if (typeof chunk === 'object' && !Array.isArray(chunk)) {
    return Object.entries(chunk)
      .reduce<string>((scss, [key, value]) => {
        const gen = getSCSS(value);
        return scss + `${key}: ${typeof value === 'object' ? `(${gen})` : gen}, `;
      }, '')
      .slice(0, -2);
  }
  return chunk as string;
};

const formatMap = (
  tokensByType: InputDataType,
  handler: ScssMapHandlerType,
  options: NonNullable<OptionsType>,
): string | void => {
  const obj = tokensByType.reduce<Record<string, any>>((acc, token) => {
    const keys: Array<string> = options.splitBy ? token.name.split(options.splitBy) : [token.name];
    const scssValue = handler.run(token.value as Parameters<ScssMapHandlerType['run']>[0], options);
    if (!scssValue) return acc;
    _.setWith(acc, keys.map(k => _[options.formatName!](k)).join('.'), scssValue, object =>
      object ? object : {},
    );
    return acc;
  }, {});

  // Useful if the border has no radius
  if (Object.keys(obj).length !== 0) {
    return `${generateVariableName({ type: tokensByType[0]!.type }, handler, options)}: (${getSCSS(
      handler.sort(obj),
    )});`;
  }
};

const generateCommon = (
  tokensByType: InputDataType,
  handler: ScssMapHandlerType,
  options: OptionsType,
  scssType: 'function' | 'mixin',
  functionNameBase: string = '',
): string => {
  const variableName = generateVariableName({ type: tokensByType[0]!.type }, handler, options);
  const functionName =
    generateName(
      { type: tokensByType[0]!.type },
      handler,
      options,
      (scssType + 'Name') as 'functionName' | 'mixinName',
    ) || `${functionNameBase}${_.kebabCase(variableName)}`;

  const head = `@${scssType} ${functionName}($levels...) {`;
  const body = `$fetched: ${variableName};
@each $level in $levels {
  @if map-has-key($fetched, $level) {
    $fetched: map-get($fetched, $level);
  } @else {
    @error "There is no \`#{$level}\` in the \`#{${variableName}}\` map";
  }
}`;
  const footer = `@if type-of($fetched) ${scssType === 'function' ? '==' : '!='} map {
  @error "Non usable value. Got \`#{${variableName}}\`";
}`;

  return `${head}${os.EOL}${body}${os.EOL}${footer}`;
};

const generateFunction = (
  tokensByType: InputDataType,
  handler: ScssMapHandlerType,
  options: OptionsType,
): string => {
  const commonBody = generateCommon(tokensByType, handler, options, 'function', 'get-');

  return `${commonBody}${os.EOL}${os.EOL}\t@return $fetched${os.EOL}}`;
};

const generateMixin = (
  tokensByType: InputDataType,
  handler: ScssMapHandlerType,
  options: OptionsType,
): string => {
  const commonBody = generateCommon(tokensByType, handler, options, 'mixin');

  return `${commonBody}${os.EOL}${os.EOL}\t@each $prop, $value in $fetched {${os.EOL}#{$prop}: $value${os.EOL}}${os.EOL}}`;
};

export async function toScssMap<T extends InputDataType>(tokens: T, options: OptionsType = {}) {
  try {
    options.formatName = options.formatName || 'camelCase';
    const tokensGroupByType = _.groupBy(tokens, 'type');

    return Object.entries(tokensGroupByType).reduce<Array<DownloadableFile>>(
      (typesAcc, [type, tokensByType]: [string, InputDataType]) => {
        if (tokensByType.length === 0 || !(type in TokensHandler)) return typesAcc;
        return typesAcc.concat(
          TokensHandler[type as Pick<DesignTokensType, 'type'>['type']].reduce<
            Array<DownloadableFile>
          >((acc, scssHandler) => {
            const fileName = generateFileName(
              { type: tokensByType[0]!.type },
              scssHandler,
              options,
            );

            const ScssLibs = `@use 'sass:map';${os.EOL}${os.EOL}`;
            const map = formatMap(tokensByType, scssHandler, options);
            if (!map) return acc;
            const ScssFunction =
              TYPES_USING_FUNCTION.includes(scssHandler.name) && !options.omitFunctionAndMixin
                ? generateFunction(tokensByType, scssHandler, options)
                : '';
            const ScssMixin =
              TYPES_USING_MIXIN.includes(scssHandler.name) && !options.omitFunctionAndMixin
                ? generateMixin(tokensByType, scssHandler, options)
                : '';
            return [
              ...acc,
              {
                name: `${fileName}.scss`,
                value: {
                  content: prettier.format(ScssLibs + map + ScssFunction + ScssMixin, {
                    parser: 'scss',
                    ...options.formatConfig,
                  }),
                },
              },
            ];
          }, []),
        );
      },
      [],
    );
  } catch (err) {
    throw err;
  }
}
