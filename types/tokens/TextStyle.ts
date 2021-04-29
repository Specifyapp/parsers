import Token, { TokenInterface } from './Token';
import { ColorToken, ColorValue } from './Color';
import { MeasurementToken, MeasurementValue } from './Measurement';
import { FontToken, FontValue } from './Font';
import { TokensType } from './index';

export type TextTransformValue =
  | 'none'
  | 'capitalize'
  | 'uppercase'
  | 'lowercase'
  | 'full-width'
  | 'full-size-kana';

export type FontVariantValue =
  | 'normal'
  | 'none'
  | 'small-caps'
  | 'all-small-caps'
  | 'petite-caps'
  | 'all-petite-caps'
  | 'unicase'
  | 'titling-caps'
  | 'common-ligatures'
  | 'no-common-ligatures'
  | 'discretionary-ligatures'
  | 'no-discretionary-ligatures'
  | 'historical-ligatures'
  | 'no-historical-ligatures'
  | 'contextual'
  | 'no-contextual'
  | 'ordinal'
  | 'slashed-zero'
  | 'lining-nums'
  | 'proportional-nums'
  | 'tabular-nums'
  | 'diagonal-fractions'
  | 'stacked-fractions'
  | 'oldstyle-nums';

export type TextDecorationValue =
  | 'none'
  | 'underline'
  | 'overline'
  | 'line-through'
  | 'dashed'
  | 'wavy';

export type TextAlignValue =
  | 'initial'
  | 'left'
  | 'right'
  | 'center'
  | 'justify'
  | 'start'
  | 'end'
  | 'justify-all'
  | 'match-parent';

export type VerticalAlignValue =
  | 'initial'
  | 'baseline'
  | 'sub'
  | 'super'
  | 'text-top'
  | 'text-bottom'
  | 'middle'
  | 'top'
  | 'bottom'
  | 'center';

export interface TextStyleValue {
  color?:
    | ColorToken
    | {
        value: ColorValue;
      };
  font:
    | FontToken
    | {
        value: FontValue;
      };
  fontSize:
    | MeasurementToken
    | {
        value: MeasurementValue;
      };
  lineHeight:
    | MeasurementToken
    | {
        value: MeasurementValue;
      };
  letterSpacing?:
    | MeasurementToken
    | {
        value: MeasurementValue;
      };
  textAlign?: {
    horizontal?: TextAlignValue;
    vertical?: VerticalAlignValue;
  };
  textTransform?: TextTransformValue;
  fontVariant?: Array<FontVariantValue>;
  textDecoration?: Array<TextDecorationValue>;
  textIndent?:
    | MeasurementToken
    | {
        value: MeasurementValue;
      };
}

export class TextStyleToken extends Token implements TokenInterface {
  type: TokensType = 'textStyle';
  value: TextStyleValue;

  constructor(element: Partial<TextStyleToken>) {
    super(element);
    this.value = element.value!;
  }
}
