import { ColorToken } from '@specifyapp/types';
import tinycolor from 'tinycolor2';
import { ColorsFormat } from '../to-css.parser';

export class Color extends ColorToken {
  constructor() {
    super();
  }
  toCss(format: ColorsFormat = 'rgb'): string {
    return tinycolor(this.value).toString(format);
  }
}
