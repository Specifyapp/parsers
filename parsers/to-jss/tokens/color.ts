import tinycolor from 'tinycolor2';
import { FormatTokenType } from '../to-jss.parser';
import { ColorToken } from '../../../types';

export class Color extends ColorToken {
  constructor(token: Partial<ColorToken>) {
    super(token);
  }
  toJss({ colorFormat = 'rgb' }: FormatTokenType): string {
    return `'${tinycolor(this.value).toString(colorFormat)}'`;
  }
}
