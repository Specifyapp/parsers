import Token, { TokenInterface } from './Token';
import { ColorValue } from './Color';
import { MeasurementValue } from './Measurement';
import { FontToken, FontValue } from './Font';

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
  | 'bottom';

export interface TextStyleValue {
  color?: {
    value: ColorValue;
  };
  font:
    | FontToken
    | {
        value: FontValue;
      };
  fontSize: {
    value: MeasurementValue;
  };
  lineHeight?: {
    value: MeasurementValue;
  };
  letterSpacing?: {
    value: MeasurementValue;
  };
  textAlign?: {
    horizontal?: TextAlignValue;
    vertical?: VerticalAlignValue;
  };
  textTransform?: TextTransformValue;
  fontVariant?: Array<FontVariantValue>;
  textDecoration?: Array<TextDecorationValue>;
  textIndent?: {
    value: MeasurementValue;
  };
}

export class TextStyleToken extends Token implements TokenInterface {
  type: string;
  value: TextStyleValue;

  constructor(element: Partial<TextStyleToken>) {
    super(element);
    this.type = 'textStyle';
    this.value = element.value!;
  }
}
