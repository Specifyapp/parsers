import { BorderValue } from '../../../types';
import { sortObjectByKey } from './index';
import { ScssMapHandlerType } from '../to-scss-map.type';

export const handler: ScssMapHandlerType = {
  name: 'borderRadius',
  run: value => {
    const { radii } = value as BorderValue;
    return radii ? `${radii?.value.measure}${radii?.value.unit}` : null;
  },
  sort(list: Record<string, any>) {
    return sortObjectByKey(list);
  },
};
