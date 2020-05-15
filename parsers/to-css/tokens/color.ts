import { ColorToken } from '@specifyapp/types';
import tinycolor from 'tinycolor2';
import { ParserContext } from '../to-css.parser';

export class Color extends ColorToken {
  constructor() {
    super();
  }
  toCss(format: ParserContext['options']['formatTokens']['color'] = 'rgb'): string {
    return tinycolor(this.value).toString(format);
  }
}
