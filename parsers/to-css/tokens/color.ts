import { ColorToken } from '@specifyapp/types';
import tinycolor from 'tinycolor2';
import { OptionsType } from '../to-css.parser';

export class Color extends ColorToken {
  constructor() {
    super();
  }
  toCss(options: OptionsType): string {
    return tinycolor(this.value).toString(options?.formatTokens?.color || 'rgb');
  }
}
