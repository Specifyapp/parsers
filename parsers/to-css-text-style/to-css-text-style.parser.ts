import { LibsType } from '../global-libs';
import {
  ColorValue,
  FontToken,
  FontValue,
  FontVariantValue,
  MeasurementValue,
  TextDecorationValue,
  TextStyleValue,
  TextStyleToken,
  TextTransformValue,
  IToken
} from '../../types';
import * as os from 'os';
import tinycolor from 'tinycolor2';
import prettier from 'prettier/standalone';
import parserCss from 'prettier/parser-postcss';
import _ from 'lodash';
import convertMeasurement from '../../libs/size-manipulation';
const propertiesBase: Array<FilterList> = [
  'color',
  'font',
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'textTransform',
  'fontVariant',
  'textDecoration',
  'textIndent',
];

const propertiesBaseInCss = [
  'color',
  'font-family',
  'font-weight',
  'font-size',
  'line-height',
  'letter-spacing',
  'text-align',
  'vertical-align',
  'text-transform',
  'font-variant',
  'text-decoration',
  'text-indent',
] as const;

export type InputDataType = Array<Pick<IToken, 'name' | 'value' | 'type'> & Record<string, any>>;
export type OutputDataType = string;
type FilterListFromTextStyle = keyof TextStyleValue;
type FilterListFromCssProperties = typeof propertiesBaseInCss[number];
type FilterList = FilterListFromTextStyle | FilterListFromCssProperties;
type Properties = { include: Array<FilterList> } | { exclude: Array<FilterList> };
type ColorsFormat =
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
type transformFn = 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
export type OptionsType = Partial<
  {
    prefix?: string;
    suffix?: string;
    colorFormat?: ColorsFormat;
    cssClassFormat?: transformFn;
    fontFamilyFormat?: transformFn;
    genericFamily?: 'serif' | 'sans-serif' | 'cursive' | 'fantasy' | 'monospace';
    relativeLineHeight?: boolean;
    prettierConfig?: Partial<{
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
    }>;
  } & Properties
>;

class ToCssTextStyle {
  font: FontValue;
  fontName: string;
  color?: ColorValue;
  fontSize?: MeasurementValue;
  lineHeight?: MeasurementValue;
  letterSpacing?: MeasurementValue;
  textIndent?: MeasurementValue;
  textAlign?: TextStyleValue['textAlign'];
  textTransform?: TextTransformValue;
  fontVariant?: Array<FontVariantValue>;
  textDecoration?: Array<TextDecorationValue>;
  cssContent: Array<string> = [];
  name: string;
  cssProperties: Array<FilterListFromCssProperties>;
  options?: OptionsType;
  constructor(
    textStyle: TextStyleValue,
    name: string,
    cssProperties: Array<FilterListFromCssProperties>,
    options: OptionsType | undefined,
  ) {
    this.font = textStyle.font.value;
    this.fontName = (textStyle.font as FontToken).name ?? this.font.fontPostScriptName;
    this.color = textStyle.color?.value;
    this.fontSize = textStyle.fontSize?.value;
    this.textAlign = textStyle.textAlign;
    this.lineHeight = textStyle.lineHeight?.value;
    this.letterSpacing = textStyle.letterSpacing?.value;
    this.textIndent = textStyle.textIndent?.value;
    this.textTransform = textStyle.textTransform;
    this.fontVariant = textStyle.fontVariant;
    this.textDecoration = textStyle.textDecoration;
    this.name = name;
    this.cssProperties = cssProperties;
    this.options = options;
  }

  isIncluded(property: FilterListFromCssProperties) {
    return this.cssProperties.includes(property);
  }

  trigger = {
    font: () => {
      if (this.isIncluded('font-family')) {
        let fontFamily = applyTransformStr(this.fontName, this.options?.fontFamilyFormat);
        if (this.options?.genericFamily) fontFamily += `, ${this.options.genericFamily}`;
        this.cssContent.push(`font-family: ${fontFamily}`);
      }
      if (this.isIncluded('font-weight')) {
        this.cssContent.push(`font-weight: ${this.font?.fontWeight}`);
      }
    },

    fontSize: () => {
      if (this.isIncluded('font-size')) {
        this.cssContent.push(`font-size: ${this.fontSize?.measure}${this.fontSize?.unit}`);
      }
    },

    color: () => {
      if (this.isIncluded('color')) {
        this.cssContent.push(
          `color: ${tinycolor(this.color).toString(this.options?.colorFormat || 'rgb')}`,
        );
      }
    },
    lineHeight: () => {
      if (this.isIncluded('line-height') && this.lineHeight) {
        let lineHeight;
        if (this.options?.relativeLineHeight) {
          lineHeight =
            Math.round(
              (convertMeasurement(this.lineHeight, 'px').measure /
                convertMeasurement(this.fontSize!, 'px').measure) *
                100,
            ) / 100;
        } else {
          lineHeight = `${this.lineHeight?.measure}${this.lineHeight?.unit || ''}`;
        }
        this.cssContent.push(`line-height: ${lineHeight}`);
      }
    },

    letterSpacing: () => {
      if (this.isIncluded('letter-spacing')) {
        this.cssContent.push(
          `letter-spacing: ${this.letterSpacing?.measure}${this.letterSpacing?.unit || ''}`,
        );
      }
    },
    textAlign: () => {
      if (this.isIncluded('text-align')) {
        if (this.textAlign?.horizontal) {
          this.cssContent.push(`text-align: ${this.textAlign.horizontal}`);
        }
      }
      if (this.isIncluded('vertical-align')) {
        if (this.textAlign?.vertical) {
          this.cssContent.push(`vertical-align: ${this.textAlign.vertical}`);
        }
      }
    },
    textTransform: () => {
      if (this.isIncluded('text-transform')) {
        this.cssContent.push(`text-transform: ${this.textTransform}`);
      }
    },
    textDecoration: () => {
      if (this.isIncluded('text-decoration') && this.textDecoration) {
        this.cssContent.push(`text-decoration: ${this.textDecoration.join(' ')}`);
      }
    },
    textIndent: () => {
      if (this.isIncluded('text-indent')) {
        this.cssContent.push(`text-indent: ${this.textIndent?.measure}${this.textIndent?.unit}`);
      }
    },
    fontVariant: () => {
      if (this.isIncluded('font-variant')) {
        this.cssContent.push(`font-variant: ${this.fontVariant?.join(' ')}`);
      }
    },
  };
}

const getTextStyleProperties = function (options?: OptionsType) {
  let textStyleProperties = propertiesBase;
  if (
    options &&
    'include' in options &&
    options.include &&
    options.include.some(property => propertiesBase.includes(property))
  ) {
    textStyleProperties = options.include.filter(property => {
      return propertiesBase.includes(property);
    });
  } else if (
    options &&
    'exclude' in options &&
    options.exclude &&
    options.exclude.some(property => propertiesBase.includes(property))
  ) {
    textStyleProperties = textStyleProperties.filter(property => {
      return propertiesBase.includes(property) && !options.exclude!.includes(property);
    });
  }
  return textStyleProperties;
};

const getCssProperties = function (options?: OptionsType) {
  let cssProperties: FilterListFromCssProperties[] = [...propertiesBaseInCss];
  if (
    options &&
    'include' in options &&
    options.include &&
    options.include.some(property =>
      propertiesBaseInCss.includes(property as FilterListFromCssProperties),
    )
  ) {
    cssProperties = options.include.filter(property => {
      return propertiesBaseInCss.includes(property as FilterListFromCssProperties);
    }) as Array<FilterListFromCssProperties>;
  } else if (
    options &&
    'exclude' in options &&
    options.exclude &&
    options.exclude.some(property =>
      propertiesBaseInCss.includes(property as FilterListFromCssProperties),
    )
  ) {
    cssProperties = cssProperties.filter(property => {
      return (
        propertiesBaseInCss.includes(property as FilterListFromCssProperties) &&
        !options.exclude!.includes(property)
      );
    });
  }
  return cssProperties;
};

const applyTransformStr = (str: string, fn?: transformFn) => {
  if (fn) return _[fn](str);
  return str.includes(' ') || str.includes('\n') || str.includes('/') ? JSON.stringify(str) : str;
};

export default async function (
  inputData: InputDataType,
  options: OptionsType | undefined,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType | Error> {
  try {
    const textStylesProperties = getTextStyleProperties(options);
    const cssProperties = getCssProperties(options);
    const result = (inputData
      .filter((token) => token.type === 'textStyle') as Array<TextStyleToken>).map(token => {
        const toCssTextStyle = new ToCssTextStyle(token.value, token.name, cssProperties, options);
  
        textStylesProperties.forEach(property => {
          if (property in toCssTextStyle && !!toCssTextStyle[property as keyof TextStyleValue]) {
            toCssTextStyle.trigger[property as keyof ToCssTextStyle['trigger']]();
          }
        });

        if (options?.prefix) token.name = `${options.prefix}${token.name}`;
        if (options?.suffix) token.name = `${token.name}${options.suffix}`;
        let name = applyTransformStr(token.name, options?.cssClassFormat || 'kebabCase');
        return `.${name} {${toCssTextStyle.cssContent.join(';' + os.EOL)}}`;
      }).join(os.EOL + os.EOL);

    return prettier.format(result, {
      ...options?.prettierConfig,
      parser: 'css',
      plugins: [parserCss],
    });
  } catch (err) {
    throw err;
  }
}
