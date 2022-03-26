import { OpacityValue } from '../../../types';
import { sortObjectByValue } from './index';
import { ScssMapHandlerType } from '../to-scss-map.type';

export const handler: ScssMapHandlerType = {
  name: 'opacity',
  run: value => {
    return (value as OpacityValue).opacity / 100;
  },
  sort(list: Record<string, any>) {
    return sortObjectByValue(list);
  },
};
