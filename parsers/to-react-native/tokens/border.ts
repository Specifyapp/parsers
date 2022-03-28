import { BorderToken } from '../../../types/tokens/Border';
import { OptionsType } from '../to-react-native.parser';
import tinycolor from 'tinycolor2';

export class Border extends BorderToken {
  constructor(token: Partial<BorderToken>) {
    super(token);
  }

  toReactNative({ colorFormat = 'rgb' }: OptionsType = {}) {
    const { color, type, width, radii } = this.value;
    const { measure } = width.value;
    return JSON.stringify({
      borderWidth: measure,
      borderStyle: type.toLowerCase(),
      borderColor: tinycolor(color.value).toString(colorFormat),
      borderRadius: radii?.value.measure,
    });
  }
}
