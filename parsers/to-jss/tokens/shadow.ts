import { ShadowToken } from '../../../types';
import { FormatTokenType } from '../to-jss.parser';
import tinycolor from 'tinycolor2';

export class Shadow extends ShadowToken {
  constructor(token: Partial<ShadowToken>) {
    super(token);
  }

  toJss({ shadowFormat = 'string', colorFormat = 'rgb' }: FormatTokenType) {
    return this.value.reduce((acc, shadow, idx, arr) => {
      const { color, offsetX, offsetY, blur, isInner, spread } = shadow;
      const x = offsetX.value;
      const y = offsetY.value;
      const bl = blur.value;
      const innerText = isInner
        ? {
            string: 'inset ',
            array: "'inset', ",
            object: 'inset',
          }[shadowFormat]
        : '';
      const prepend = idx
        ? {
            string: acc + ', ',
            array: acc + '], [',
            object: acc + ', ',
          }[shadowFormat]
        : '';
      const before = !idx
        ? {
            string: "'",
            array: '[[',
            object: '[',
          }[shadowFormat]
        : '';
      const after = !arr[idx + 1]
        ? {
            string: "'",
            array: ']]',
            object: ']',
          }[shadowFormat]
        : '';

      if (shadowFormat === 'object')
        return (
          before +
          prepend +
          JSON.stringify({
            x: x.measure,
            y: y.measure,
            blur: bl.measure,
            spread: spread?.value || 0,
            color: tinycolor(color.value).toString(colorFormat),
            inset: innerText,
          }) +
          after
        );
      else if (shadowFormat === 'array')
        return `${before}${prepend}${innerText}${x.measure}, ${y.measure}, ${bl.measure}${
          spread ? `, ${spread.value.measure}` : ''
        },'${tinycolor(color.value).toString(colorFormat)}'${after}`;
      else
        return `${before}${prepend}${innerText}${x.measure}${x.unit} ${y.measure}${y.unit} ${
          bl.measure
        }${bl.unit}${spread ? ` ${spread.value.measure}${spread.value.unit}` : ''} ${tinycolor(
          color.value,
        ).toString(colorFormat)}${after}`;
    }, '');
  }
}
