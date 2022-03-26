import { DepthValue } from '../../../types';
import { sortObjectByValue } from './index';
import { ScssMapHandlerType } from '../to-scss-map.type';

export const handler: ScssMapHandlerType = {
  name: 'depth',
  run: value => {
    return (value as DepthValue).depth;
  },
  sort(list: Record<string, any>) {
    return sortObjectByValue(list);
  },
};
