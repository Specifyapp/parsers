import tinycolor from 'tinycolor2';
import { TextStyleToken } from '../../../types';
import { OptionsType } from '../to-css-custom-properties.parser';

export class TextStyle extends TextStyleToken {
  constructor(token: Partial<TextStyleToken>) {
    super(token);
  }

  public custom = true;

  toCss(options: OptionsType, name: string) {
    const BASE = `--${name}`;

    return [
      !!this.value.color
        ? `${BASE}-color: ${tinycolor(this.value.color.value).toString(
            options?.formatTokens?.color || 'rgb',
          )};`
        : undefined,
      `${BASE}-font-family: ${this.value.font.value.fontFamily};`,
      `${BASE}-font-weight: ${this.value.font.value.fontWeight};`,
      !!this.value.font.value.isItalic ? `${BASE}-font-style: italic;` : undefined,
      `${BASE}-font-size: ${this.value.fontSize.value.measure}${this.value.fontSize.value.unit};`,
      !!this.value.fontVariant
        ? `${BASE}-font-variant: ${this.value.fontVariant.join(' ')};`
        : undefined,
      !!this.value.letterSpacing
        ? `${BASE}-letter-spacing: ${this.value.letterSpacing.value.measure}${this.value.letterSpacing.value.unit};`
        : undefined,
      `${BASE}-line-height: ${this.value.lineHeight.value.measure}${this.value.lineHeight.value.unit};`,
      !!this.value.textAlign?.horizontal
        ? `${BASE}-text-align: ${this.value.textAlign.horizontal};`
        : undefined,
      !!this.value.textDecoration
        ? `${BASE}-text-decoration: ${this.value.textDecoration.join(' ')};`
        : undefined,
      !!this.value.textIndent
        ? `${BASE}-text-ident: ${this.value.textIndent.value.measure}${this.value.textIndent.value.unit};`
        : undefined,
      !!this.value.textTransform
        ? `${BASE}-text-transform: ${this.value.textTransform};`
        : undefined,
    ]
      .filter(v => !!v)
      .join('');
  }
}
