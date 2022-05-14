import tinycolor from 'tinycolor2';
import { OptionsType } from '../to-scss-variables.parser';
import { ColorToken } from '../../../types';

export class Color extends ColorToken {
  constructor(token: Partial<ColorToken>) {
    super(token);
  }
  toScss(options: OptionsType): string {
    return tinycolor(this.value).toString(options?.formatTokens?.color || 'rgb');
  }
}
