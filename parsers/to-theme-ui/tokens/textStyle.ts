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
    return `${lh.value.measure}${lh.value.unit}`;
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
    result.lineHeights = { [this.transformedName]: lineHeight };

    if (options?.variants) {
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
      const fontFamily =
        'id' in spToken.value.font && Indexes.Instance.list.fonts?.[spToken.value.font.id]
          ? Indexes.Instance.list.fonts[spToken.value.font.id]
          : spToken.value.font.value.fontPostScriptName;

      const variantValue: Record<string, string | number> = { fontFamily: fontFamily };

      if (spToken.value.textTransform) variantValue.textTransform = spToken.value.textTransform;

      if (spToken.value.letterSpacing) {
        variantValue.letterSpacing =
          spToken.value.letterSpacing &&
          'id' in spToken.value.letterSpacing &&
          Indexes.Instance.list.letterSpacings?.[spToken.value.letterSpacing.id]
            ? Indexes.Instance.list.letterSpacings[spToken.value.letterSpacing.id]
            : `${spToken.value.letterSpacing.value.measure}${spToken.value.letterSpacing.value.unit}`;
      }

      if (spToken.value.lineHeight) {
        variantValue.lineHeight =
          spToken.value.lineHeight &&
          'id' in spToken.value.lineHeight &&
          Indexes.Instance.list.lineHeights?.[spToken.value.lineHeight.id]
            ? Indexes.Instance.list.lineHeights[spToken.value.lineHeight.id]
            : `${spToken.value.lineHeight.value.measure}${spToken.value.lineHeight.value.unit}`;
      }

      if (spToken.value.textIndent) {
        variantValue.textIndent =
          spToken.value.textIndent &&
          'id' in spToken.value.textIndent &&
          Indexes.Instance.list.sizes?.[spToken.value.textIndent.id]
            ? Indexes.Instance.list.sizes[spToken.value.textIndent.id]
            : `${spToken.value.textIndent.value.measure}${spToken.value.textIndent.value.unit}`;
      }

      if (spToken.value.fontSize) {
        if (
          spToken.value.fontSize &&
          'id' in spToken.value.fontSize &&
          Indexes.Instance.list.fontSizes?.[spToken.value.fontSize.id]
        ) {
          variantValue.fontSize = (themeUiTokens.fontSizes as NonNullable<
            ThemeUiTextStyle['fontSizes']
          >).findIndex(
            fontSize =>
              fontSize ===
              Indexes.Instance.list.fontSizes![(spToken.value.fontSize as MeasurementToken).id],
          );
        } else {
          variantValue.fontSize = `${spToken.value.fontSize.value.measure}${spToken.value.fontSize.value.unit}`;
        }
      }

      if (spToken.value.font.value.fontWeight) {
        variantValue.fontWeight =
          spToken.value.font.value.fontWeight &&
          'id' in spToken.value.font &&
          Indexes.Instance.list.fontWeights?.[spToken.value.font.id]
            ? Indexes.Instance.list.fontWeights[spToken.value.font.id]
            : spToken.value.font.value.fontWeight;
      }

      if (spToken.value.color) {
        variantValue.color =
          spToken.value.color &&
          'id' in spToken.value.color &&
          Indexes.Instance.list.colors?.[spToken.value.color.id]
            ? Indexes.Instance.list.colors[spToken.value.color.id]
            : tinycolor(spToken.value.color.value).toString(
                options?.formatTokens?.colorFormat?.format || 'rgb',
              );
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
}
