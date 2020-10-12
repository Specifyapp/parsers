import { TextStyleToken } from '../../../types';
import { FormatTokenType } from '../to-jss.parser';
import tinycolor from 'tinycolor2';

export class TextStyle extends TextStyleToken {
  constructor(token: Partial<TextStyleToken>) {
    super(token);
  }

  toJss({ textStyleFormat = 'classObject', colorFormat = 'hex' }: FormatTokenType) {
    const { font, color: c, size: fs, lineHeight: lh } = this.value;
    const { fontPostScriptName, fontWeight } = font.value;
    const color = c.value;
    const { measure: fontSize, unit: fsUnit } = fs.value;
    const { measure: lineHeight, unit: lhUnit } = lh.value;
    const fontObject = {
      style: null, // TODO add font-style value to api results
      variant: null, // TODO add font-variant value to api results
      weight: fontWeight,
      size: fontSize,
      lineHeight: lineHeight,
      family: fontPostScriptName
    }
    return {
      object: JSON.stringify(fontObject),
      classObject: JSON.stringify({
        color: tinycolor(color).toString(colorFormat),
        font: fontObject,
      }),
      array: JSON.stringify([fontWeight, `${fontSize + fsUnit}/${lineHeight + lhUnit}`, fontPostScriptName]),
      string: `'${fontWeight} ${fontSize}${fsUnit}/${lineHeight}${lhUnit} ${fontPostScriptName}'`
    }[textStyleFormat];
  }
}
