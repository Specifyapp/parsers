import { DurationValue } from '../../../types';
import { sortObjectByValue } from './index';
import { ScssMapHandlerType } from '../to-scss-map.type';

const handler: ScssMapHandlerType = {
  name: 'duration',
  run: value => {
    const { duration, unit } = value as DurationValue;
    return `${duration}${unit}`;
  },
  sort(list: Record<string, any>) {
    // sort by value including unit. 3s > 900ms
    return sortObjectByValue(list);
  },
};

export default handler;
