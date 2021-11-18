import { FontToken, TextStyleToken } from '../../../types';
import convertMeasurement from '../../../libs/size-manipulation';
import { Utils } from './index';
import { ColorsFormat, TailwindMappingTypes, TextStyleMapping } from '../to-tailwind.type';
import { FormatTokenType, OptionsType } from '../to-tailwind.parser';
import tinycolor from 'tinycolor2';

export class TextStyle extends TextStyleToken {
  token: Partial<TextStyleToken>;
  constructor(token: Partial<TextStyleToken>, transformNameFn: Function) {
    super(token);
    this.token = { ...token, name: transformNameFn(token.name) };
  }

  private getFontWeight() {
    const fw = this.value.font.value.fontWeight;
    return fw;
  }
  private getLetterSpacing() {
    const ls = this.value.letterSpacing;
    if (ls) return `${ls.value.measure}${ls.value.unit}`;
  }
  private getLineHeight() {
    const lh = this.value.lineHeight;
    return `${lh.value.measure}${lh.value.unit}`;
  }
  private getColor(format: ColorsFormat) {
    if (this.value.color?.value) {
      return tinycolor(this.value.color?.value).toString(format);
    }
  }
  private getOpacity() {
    if (this.value.color?.value?.a && this.value.color?.value?.a < 1)
      return `${this.value.color.value.a}`;
  }

  private getFontFamily() {
    return (this.value.font as FontToken).name ?? this.value.font.value.fontPostScriptName;
  }

  private getFontSize(fontFormat: FormatTokenType['fontSizeFormat']) {
    const fontSize = this.value.fontSize;
    if (fontFormat?.unit && this.value.fontSize.value.unit !== fontFormat?.unit) {
      this.value.fontSize.value = convertMeasurement(this.value.fontSize.value, fontFormat?.unit);
    }
    return `${fontSize.value.measure}${fontSize.value.unit}`;
  }

  generate(options: OptionsType): TextStyleMapping {
    const result: TextStyleMapping = {};

    const fontSizeKeyName = Utils.getTemplatedTokenName(this.token, options?.renameKeys?.fontSize);
    result.fontSize = {
      [fontSizeKeyName]: this.getFontSize(options?.formatTokens?.fontSizeFormat),
    };

    const letterSpacingKeyName = Utils.getTemplatedTokenName(
      this.token,
      options?.renameKeys?.letterSpacing,
    );
    const letterSpacing = this.getLetterSpacing();
    if (letterSpacing) result.letterSpacing = { [letterSpacingKeyName]: letterSpacing };

    const lineHeightKeyName = Utils.getTemplatedTokenName(
      this.token,
      options?.renameKeys?.lineHeight,
    );
    const lineHeight = this.getLineHeight();
    result.lineHeight = { [lineHeightKeyName]: lineHeight };

    const textColor = this.getColor(options?.formatTokens?.colorFormat?.format || 'hex');
    const textColorKeyName = Utils.getTemplatedTokenName(
      this.token,
      options?.renameKeys?.textColor,
    );
    if (textColor) result.textColor = { [textColorKeyName]: textColor };

    const textOpacity = this.getOpacity();
    const textOpacityKeyName = Utils.getTemplatedTokenName(
      this.token,
      options?.renameKeys?.textOpacity,
    );
    if (textOpacity) result.textOpacity = { [textOpacityKeyName]: textOpacity };

    const fontFamily = this.getFontFamily();
    const fontFamilyKeyName = Utils.getTemplatedTokenName(
      this.token,
      options?.renameKeys?.fontFamily,
    );
    result.fontFamily = { [fontFamilyKeyName]: [fontFamily] };

    const fontWeight = this.getFontWeight();
    const fontWeightKeyName = Utils.getTemplatedTokenName(
      this.token,
      options?.renameKeys?.fontWeight,
    );
    result.fontWeight = { [fontWeightKeyName]: fontWeight };

    return result;
  }

  static afterGenerate(TailwindTokens: TailwindMappingTypes) {
    if (TailwindTokens.fontSize)
      TailwindTokens.fontSize = Utils.sortObject(TailwindTokens.fontSize);

    if (TailwindTokens.fontWeight)
      TailwindTokens.fontWeight = Utils.sortObject(TailwindTokens.fontWeight);

    if (TailwindTokens.lineHeight)
      TailwindTokens.lineHeight = Utils.sortObject(TailwindTokens.lineHeight);

    if (TailwindTokens.letterSpacing)
      TailwindTokens.letterSpacing = Utils.sortObject(TailwindTokens.letterSpacing);

    if (TailwindTokens.textColor)
      TailwindTokens.textColor = Utils.sortObject(TailwindTokens.textColor);

    if (TailwindTokens.textOpacity)
      TailwindTokens.textOpacity = Utils.sortObject(TailwindTokens.textOpacity);

    return TailwindTokens;
  }
}
