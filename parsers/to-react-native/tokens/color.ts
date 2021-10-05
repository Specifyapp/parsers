import tinycolor from 'tinycolor2';
import { OptionsType } from '../to-react-native.parser';
import { ColorToken } from '../../../types';

export class Color extends ColorToken {
  constructor(token: Partial<ColorToken>) {
    super(token);
  }
  toReactNative({ colorFormat = 'rgb' }: OptionsType = {}): string {
    return `'${tinycolor(this.value).toString(colorFormat)}'`;
  }
}
