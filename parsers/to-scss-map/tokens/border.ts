import { BorderValue } from '../../../types';
import tinycolor from 'tinycolor2';
import { sortObjectByKey } from './index';
import { ScssMapHandlerType } from '../to-scss-map.type';

const handler: ScssMapHandlerType = {
  name: 'border',
  run: (value, options) => {
    const { color, type, width } = value as BorderValue;
    const { measure, unit } = width.value;
    return `${measure}${unit} ${type.toLowerCase()} ${tinycolor(color.value).toString(
      options?.formatTokens?.color?.format || 'rgb',
    )}`;
  },
  sort(list: Record<string, any>) {
    return sortObjectByKey(list);
  },
};
export default handler;
