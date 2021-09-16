import { IToken, MeasurementToken, TextStyleToken } from '../../../types';
import convertMeasurement from '../../../libs/size-manipulation';
import { ThemeUiTypes } from '../to-theme-ui.type';
import { Utils } from './index';
import { FormatTokenType, Indexes, OptionsType } from '../to-theme-ui.parser';
import tinycolor from 'tinycolor2';

export interface ThemeUiTextStyle extends Partial<Record<ThemeUiTypes, any>> {
  fontSizes?: Array<number | string>;
  letterSpacings?: Record<string, number | string>;
  lineHeights?: Record<string, number | string>;
}

type ComputeParamsFn = {
  spToken: TextStyleToken;
  themeUiTokens?: Partial<Record<ThemeUiTypes, any>>;
  options?: OptionsType;
};

export class TextStyle extends TextStyleToken {
  transformedName: string;
  constructor(token: Partial<TextStyleToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }

  private getLetterSpacings() {
    const ls = this.value.letterSpacing;
    if (ls) return `${ls.value.measure}${ls.value.unit}`;
  }
  private getLineHeights() {
    const lh = this.value.lineHeight;
    if (lh) return `${lh.value.measure}${lh.value.unit}`;
  }

  private getFontSizes(fontFormat: FormatTokenType['fontSizeFormat']) {
    const fontSizeType = fontFormat?.type || 'number';
    const fontSize = this.value.fontSize;
    if (fontFormat?.unit && this.value.fontSize.value.unit !== fontFormat?.unit) {
      this.value.fontSize.value = convertMeasurement(this.value.fontSize.value, fontFormat?.unit);
    }
    return fontSizeType === 'number'
      ? [fontSize.value.measure]
      : [`${fontSize.value.measure}${fontSize.value.unit}`];
  }

  generate(options: OptionsType, spTokens: Array<IToken>): ThemeUiTextStyle {
    const result: ThemeUiTextStyle = {};

    result.fontSizes = this.getFontSizes(options?.formatTokens?.fontSizeFormat);

    const letterSpacing = this.getLetterSpacings();
    if (letterSpacing) result.letterSpacings = { [this.transformedName]: letterSpacing };

    const lineHeight = this.getLineHeights();
    if (lineHeight) result.lineHeights = { [this.transformedName]: lineHeight };

    if (options?.variants) {
      if (lineHeight) {
        Indexes.Instance.add('lineHeights', lineHeight, this.transformedName);
      }
      if (letterSpacing) {
        Indexes.Instance.add('letterSpacings', letterSpacing, this.transformedName);
      }

      if (!('id' in this.value.fontSize)) {
        const fontSizeToken = new MeasurementToken({
          id: `temp-fontSize-${this.id}`,
          value: this.value.fontSize.value,
        });
        spTokens.push(fontSizeToken);
        this.value.fontSize = fontSizeToken;
        Indexes.Instance.add('fontSizes', fontSizeToken.id, result.fontSizes[0]);
      }
    }

    return result;
  }

  static afterGenerate(themeUiTokens: Record<ThemeUiTypes, any>) {
    if (themeUiTokens.fontSizes)
      themeUiTokens.fontSizes = Utils.deduplicateAndSortList(themeUiTokens.fontSizes);

    if (themeUiTokens.fontWeights)
      themeUiTokens.fontWeights = Utils.sortObject(themeUiTokens.fontWeights);

    if (themeUiTokens.lineHeights)
      themeUiTokens.lineHeights = Utils.sortObject(themeUiTokens.lineHeights);

    if (themeUiTokens.letterSpacings)
      themeUiTokens.letterSpacings = Utils.sortObject(themeUiTokens.letterSpacings);

    return themeUiTokens;
  }

  static generateVariants(
    themeUiTokens: Partial<Record<ThemeUiTypes, any>>,
    textStyles: Array<TextStyleToken>,
    options: OptionsType,
    transformNameFn: Function,
  ) {
    themeUiTokens.text = {};

    textStyles.forEach(spToken => {
      const variantValue: Record<string, string | number> = {};

      if (spToken.value.font) {
        variantValue.fontFamily =
          'id' in spToken.value?.font && Indexes.Instance.list.fonts?.[spToken.value.font.id]
            ? Indexes.Instance.list.fonts[spToken.value.font.id]
            : spToken.value.font.value.fontPostScriptName;
      }

      if (spToken.value.textTransform) variantValue.textTransform = spToken.value.textTransform;

      if (spToken.value.letterSpacing) {
        variantValue.letterSpacing = TextStyle.computeLetterSpacing({ spToken });
      }

      if (spToken.value.lineHeight) {
        variantValue.lineHeight = TextStyle.computeLineHeight({ spToken });
      }

      if (spToken.value.textIndent) {
        variantValue.textIndent = TextStyle.computeTextIndent({ spToken });
      }

      if (spToken.value.fontSize) {
        variantValue.fontSize = TextStyle.computeFontSize({ spToken, themeUiTokens });
      }

      if (spToken.value.font?.value?.fontWeight) {
        variantValue.fontWeight = TextStyle.computeFontWeight({ spToken });
      }

      if (spToken.value.color) {
        variantValue.color = TextStyle.computeColor({ spToken, options });
      }

      if (spToken.value.textAlign?.horizontal) {
        variantValue.textAlign = spToken.value.textAlign.horizontal;
      }
      if (spToken.value.textAlign?.vertical) {
        variantValue.verticalAlign = spToken.value.textAlign.vertical;
      }
      if (spToken.value.textTransform) {
        variantValue.textTransform = spToken.value.textTransform;
      }
      if (spToken.value.textDecoration) {
        variantValue.textDecoration = spToken.value.textDecoration.join(' ');
      }
      if (spToken.value.fontVariant) {
        variantValue.fontVariant = spToken.value.fontVariant.join(' ');
      }

      themeUiTokens.text[transformNameFn(spToken.name)] = variantValue;
    });
    return themeUiTokens;
  }

  static computeLetterSpacing({ spToken }: ComputeParamsFn) {
    const letterSpacing = `${spToken.value.letterSpacing!.value.measure}${
      spToken.value.letterSpacing!.value.unit
    }`;
    if (Indexes.Instance.list.letterSpacings?.[letterSpacing]) {
      return Indexes.Instance.list.letterSpacings[letterSpacing];
    } else if (
      'id' in spToken.value.letterSpacing! &&
      Indexes.Instance.list.letterSpacings?.[spToken.value.letterSpacing.id]
    ) {
      return Indexes.Instance.list.letterSpacings[spToken.value.letterSpacing.id];
    }
    return letterSpacing;
  }

  static computeLineHeight({ spToken }: ComputeParamsFn) {
    const lineHeight = `${spToken.value.lineHeight.value.measure}${spToken.value.lineHeight.value.unit}`;

    if (Indexes.Instance.list.lineHeights?.[lineHeight]) {
      return Indexes.Instance.list.lineHeights[lineHeight];
    } else if (
      'id' in spToken.value.lineHeight! &&
      Indexes.Instance.list.lineHeights?.[spToken.value.lineHeight.id]
    ) {
      return Indexes.Instance.list.lineHeights[spToken.value.lineHeight.id];
    }
    return lineHeight;
  }

  static computeFontWeight({ spToken }: ComputeParamsFn) {
    const fontWeight = spToken.value.font.value.fontWeight;
    if (Indexes.Instance.list.fontWeights?.[fontWeight]) {
      return Indexes.Instance.list.fontWeights[fontWeight];
    } else if (
      spToken.value.font.value.fontWeight &&
      'id' in spToken.value.font &&
      Indexes.Instance.list.fontWeights?.[spToken.value.font.id]
    ) {
      return Indexes.Instance.list.fontWeights[spToken.value.font.id];
    }
    return fontWeight;
  }

  static computeColor({ spToken, options }: ComputeParamsFn) {
    const color = spToken.value.color!;
    if (
      spToken.value.color &&
      'id' in spToken.value.color &&
      Indexes.Instance.list.colors?.[spToken.value.color.id]
    ) {
      return Indexes.Instance.list.colors[spToken.value.color.id];
    }
    return tinycolor(color.value).toString(options?.formatTokens?.colorFormat?.format || 'rgb');
  }

  static computeFontSize({ spToken, themeUiTokens }: ComputeParamsFn) {
    const fontSize = `${spToken.value.fontSize.value.measure}${spToken.value.fontSize.value.unit}`;
    if (Indexes.Instance.list.fontSizes?.[fontSize]) {
      return Indexes.Instance.list.fontSizes[fontSize];
    } else if (
      spToken.value.fontSize &&
      'id' in spToken.value.fontSize &&
      Indexes.Instance.list.fontSizes?.[spToken.value.fontSize.id]
    ) {
      return (themeUiTokens!.fontSizes as NonNullable<ThemeUiTextStyle['fontSizes']>).findIndex(
        fontSize =>
          fontSize ===
          Indexes.Instance.list.fontSizes![(spToken.value.fontSize as MeasurementToken).id],
      );
    }
    return fontSize;
  }

  static computeTextIndent({ spToken }: ComputeParamsFn) {
    const textIndent = `${spToken.value.textIndent!.value.measure}${
      spToken.value.textIndent!.value.unit
    }`;

    if (
      'id' in spToken.value.textIndent! &&
      Indexes.Instance.list.sizes?.[spToken.value.textIndent.id]
    ) {
      return Indexes.Instance.list.sizes[spToken.value.textIndent.id];
    }
    return textIndent;
  }
}
