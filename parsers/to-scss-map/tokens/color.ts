import { ColorValue } from '../../../types';
import tinycolor from 'tinycolor2';
import { sortObjectByKey } from './index';
import { ScssMapHandlerType } from '../to-scss-map.type';

export const handler: ScssMapHandlerType = {
  name: 'color',
  run: (value, options) => {
    return tinycolor(value as ColorValue).toString(options?.formatTokens?.color?.format || 'rgb');
  },
  sort(list) {
    return sortObjectByKey(list);
  },
};
