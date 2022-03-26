import { ShadowValue } from '../../../types';
import tinycolor from 'tinycolor2';
import { OptionsType } from '../to-scss-map.parser';
import { sortObjectByKey } from './index';
import { ScssMapHandlerType } from '../to-scss-map.type';

export const handler: ScssMapHandlerType = {
  name: 'shadow',
  run: (value, options: OptionsType) => {
    const shadows = value as ShadowValue;
    const valueString = shadows.reduce((acc, shadow) => {
      const { color, offsetX, offsetY, blur, isInner, spread } = shadow;
      const xString = `${offsetX.value.measure}${offsetX.value.unit}`;
      const yString = `${offsetY.value.measure}${offsetY.value.unit}`;
      const blurString = `${blur.value.measure}${blur.value.unit}`;
      // Intial space in the string to avoid having double space
      const spreadString = spread ? ` ${spread.value.measure}${spread.value.unit}` : '';
      const innerText = isInner ? 'inset ' : '';
      const formatedColor = tinycolor(color.value).toString(
        options?.formatTokens?.color?.format || 'rgb',
      );
      if (acc === '') {
        return `${innerText}${xString} ${yString} ${blurString}${spreadString} ${formatedColor}`;
      }

      return `${acc}, ${innerText}${xString} ${yString} ${blurString}${spreadString} ${formatedColor}`;
    }, '');

    return `(${valueString})`;
  },
  sort(list: Record<string, any>) {
    return sortObjectByKey(list);
  },
};
