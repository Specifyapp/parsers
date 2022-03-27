import { ShadowToken } from '../../../types';
import { OptionsType } from '../to-theme-ui.parser';
import tinycolor from 'tinycolor2';
import { formatName } from './index';

export const generate = <T extends Pick<ShadowToken, 'value' | 'name' | 'id'> & object>(
  token: T,
  options: OptionsType,
) => {
  const name = formatName(token.name, options?.formatName);
  const colorFormat = options?.formatTokens?.colorFormat?.format ?? 'rgb';

  return {
    shadows: {
      [name]: token.value
        .reduce((acc, shadow) => {
          const { color, offsetX, offsetY, blur, isInner, spread } = shadow;
          const x = `${offsetX.value.measure}${offsetX.value.unit}`;
          const y = `${offsetY.value.measure}${offsetY.value.unit}`;
          const blurString = `${blur.value.measure}${blur.value.unit}`;
          const spreadString = spread ? ` ${spread.value.measure}${spread.value.unit}` : '';
          const innerText = isInner ? 'inset ' : '';
          const colorString = tinycolor(color.value).toString(colorFormat);
          acc.push(`${innerText}${x} ${y} ${blurString}${spreadString} ${colorString}`);
          return acc;
        }, [] as Array<string>)
        .join(', '),
    },
  };
};
