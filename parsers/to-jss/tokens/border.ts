import { BorderToken } from '../../../types/tokens/Border';
import { FormatTokenType } from '../to-jss.parser';
import tinycolor from 'tinycolor2';

export class Border extends BorderToken {
  constructor(token: Partial<BorderToken>) {
    super(token);
  }

  toJss({ borderFormat = 'string', colorFormat = 'rgb' }: FormatTokenType) {
    const { color, type, width } = this.value;
    const { measure, unit } = width.value;
    if (borderFormat === 'object')
      return JSON.stringify({
        width: measure,
        style: type.toLowerCase(),
        color: tinycolor(color.value).toString(colorFormat),
      });
    else if (borderFormat === 'array')
      return JSON.stringify([
        measure,
        type.toLowerCase(),
        tinycolor(color.value).toString(colorFormat),
      ]);
    else
      return `'${measure}${unit} ${type.toLowerCase()} ${tinycolor(color.value).toString(
        colorFormat,
      )}'`;
  }
}
