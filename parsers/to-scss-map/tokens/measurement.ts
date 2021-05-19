import { MeasurementValue } from '../../../types';
import { OptionsType } from '../to-scss-map.parser';
import { sortObjectByValue } from './index';
import { ScssMapHandlerType } from '../to-scss-map.type';

const handler: ScssMapHandlerType = {
  name: 'measurement',
  run: (value, options: OptionsType) => {
    const { measure, unit } = value as MeasurementValue;
    return `${measure}${unit}`;
  },
  sort(list: Record<string, any>) {
    // TODO: need natural sorting
    return sortObjectByValue(list);
  },
};

export default handler;
