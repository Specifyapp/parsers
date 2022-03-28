import { TextStyleToken } from '../../../types/tokens/TextStyle';
import { FormatTokenType } from '../to-jss.parser';
import tinycolor from 'tinycolor2';

export class TextStyle extends TextStyleToken {
  constructor(token: Partial<TextStyleToken>) {
    super(token);
  }

  toJss({ textStyleFormat = 'classObject', colorFormat = 'hex' }: FormatTokenType) {
    const { font, color: c, fontSize: fs, lineHeight: lh, letterSpacing: ls } = this.value;
    const { fontPostScriptName, fontWeight } = font.value;
    const color = c?.value;
    const { measure: fontSize, unit: fsUnit } = fs.value;
    const { measure: letterSpacing } = ls?.value ? ls.value : { measure: 'normal' };
    const { measure: lineHeight, unit: lhUnit } = lh?.value
      ? lh.value
      : { measure: 'normal', unit: 'px' };
    const fontObject = {
      style: null, // TODO add font-style value to api results
      variant: null, // TODO add font-variant value to api results
      weight: fontWeight,
      size: fontSize,
      lineHeight: lineHeight,
      family: fontPostScriptName,
    };
    return {
      object: JSON.stringify(fontObject),
      classObject: JSON.stringify({
        color: tinycolor(color).toString(colorFormat),
        font: fontObject,
        letterSpacing: letterSpacing,
      }),
      array: JSON.stringify([
        fontWeight,
        `${fontSize + fsUnit}/${lineHeight + lhUnit}`,
        fontPostScriptName,
      ]),
      string: `'${fontWeight} ${fontSize}${fsUnit}/${lineHeight}${lhUnit} ${fontPostScriptName}'`,
    }[textStyleFormat];
  }
}
