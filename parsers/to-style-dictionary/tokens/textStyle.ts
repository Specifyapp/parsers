import { TextStyleToken } from '../../../types';
import convertMeasurement from '../../../libs/size-manipulation';
import tinycolor from 'tinycolor2';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import { FormatTokenType, OptionsType } from '../to-style-dictionary';
import * as _ from 'lodash';

export class TextStyle extends TextStyleToken {
  keys: Array<string>;
  constructor(token: Partial<TextStyleToken>, keys: Array<string>) {
    super(token);
    this.keys = keys;
  }

  private getLetterSpacing() {
    const ls = this.value.letterSpacing;
    if (ls) return `${ls.value.measure}${ls.value.unit}`;
  }
  private getLineHeight() {
    const lh = this.value.lineHeight;
    return `${lh.value.measure}${lh.value.unit}`;
  }
  private getTextIndent() {
    const ti = this.value.textIndent;
    if (ti) return `${ti.value.measure}${ti.value.unit}`;
  }
  private getColor(format: NonNullable<FormatTokenType['colorFormat']>['format']) {
    if (this.value.color?.value) {
      return tinycolor(this.value.color?.value).toString(format);
    }
  }

  private getFontSize(fontFormat: FormatTokenType['fontSizeFormat']) {
    const fontSize = this.value.fontSize;
    if (fontFormat?.unit && this.value.fontSize.value.unit !== fontFormat?.unit) {
      this.value.fontSize.value =
        fontFormat?.unit === 'none' || !fontFormat.unit
          ? this.value.fontSize.value
          : convertMeasurement(this.value.fontSize.value, fontFormat?.unit);
    }
    return `${fontSize.value.measure}${fontSize.value.unit}`;
  }

  generate(options: OptionsType): Pick<BaseStyleDictionaryTokensFormat, 'color' | 'size'> {
    let result: Pick<BaseStyleDictionaryTokensFormat, 'color' | 'size'> = {};

    result = _.setWith(
      result,
      ['size', 'font', ...this.keys],
      {
        value: this.getFontSize(options?.formatTokens?.fontSizeFormat),
      },
      Object,
    );

    const letterSpacing = this.getLetterSpacing();
    if (letterSpacing) {
      _.setWith(
        result,
        ['size', 'letterSpacing', ...this.keys],
        {
          value: letterSpacing,
        },
        Object,
      );
    }

    const lineHeight = this.getLineHeight();
    if (lineHeight) {
      _.setWith(
        result,
        ['size', 'lineHeight', ...this.keys],
        {
          value: lineHeight,
        },
        Object,
      );
    }

    const textColor = this.getColor(options?.formatTokens?.colorFormat?.format || 'hex');
    if (textColor) {
      _.setWith(
        result,
        ['color', 'font', ...this.keys],
        {
          value: textColor,
        },
        Object,
      );
    }

    const textIndent = this.getTextIndent();
    if (textIndent) {
      _.setWith(
        result,
        ['size', 'textIndent', ...this.keys],
        {
          value: textIndent,
        },
        Object,
      );
    }

    return result;
  }
}
