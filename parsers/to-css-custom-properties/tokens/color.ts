import { ColorToken } from '@specifyapp/types';
import tinycolor from 'tinycolor2';
import { OptionsType } from '../to-css-custom-properties.parser';

export class Color extends ColorToken {
  constructor(token: Partial<ColorToken>) {
    super(token);
  }
  toCss(options: OptionsType): string {
    return tinycolor(this.value).toString(options?.formatTokens?.color || 'rgb');
  }
}
