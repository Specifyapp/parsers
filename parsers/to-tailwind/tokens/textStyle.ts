import { FontToken, TextStyleToken } from '../../../types';
import convertMeasurement from '../../../libs/size-manipulation';
import { Utils } from './index';
import { ColorsFormat, TailwindMappingTypes, TextStyleMapping } from '../to-tailwind.type';
import { FormatTokenType, OptionsType } from '../to-tailwind.parser';
import tinycolor from 'tinycolor2';

export class TextStyle extends TextStyleToken {
  transformedName: string;
  constructor(token: Partial<TextStyleToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
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

    result.fontSize = {
      [this.transformedName]: this.getFontSize(options?.formatTokens?.fontSizeFormat),
    };

    const letterSpacing = this.getLetterSpacing();
    if (letterSpacing) result.letterSpacing = { [this.transformedName]: letterSpacing };

    const lineHeight = this.getLineHeight();
    result.lineHeight = { [this.transformedName]: lineHeight };

    const textColor = this.getColor(options?.formatTokens?.colorFormat?.format || 'hex');
    if (textColor) result.textColor = { [this.transformedName]: textColor };

    const textOpacity = this.getOpacity();
    if (textOpacity) result.textOpacity = { [this.transformedName]: textOpacity };

    const fontFamily = this.getFontFamily();
    result.fontFamily = { [this.transformedName]: [fontFamily] };

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
