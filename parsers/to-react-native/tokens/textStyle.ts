import { TextStyleToken } from '../../../types/tokens/TextStyle';
import { OptionsType } from '../to-react-native.parser';
import tinycolor from 'tinycolor2';

export class TextStyle extends TextStyleToken {
  constructor(token: Partial<TextStyleToken>) {
    super(token);
  }

  toReactNative({ colorFormat = 'rgb' }: OptionsType = {}) {
    const { font, color: c, fontSize: fs, lineHeight: lh, letterSpacing: ls } = this.value;
    const { fontPostScriptName, fontWeight } = font.value;
    const color = c?.value;
    const fontSize = fs.value.measure;
    const letterSpacing = ls?.value?.measure;
    const lineHeight = lh?.value?.measure;

    const fontObject = {
      fontWeight: `${fontWeight || 'normal'}`,
      fontSize,
      lineHeight,
      fontFamily: fontPostScriptName,
      color: tinycolor(color).toString(colorFormat),
      letterSpacing,
    };
    return JSON.stringify(fontObject);
  }
}
