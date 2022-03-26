import convertMeasurement from '../../libs/size-manipulation';
import { MeasurementValue } from '../../types';
import { get, has, set } from 'lodash';

export type InputDataType = Array<Record<string, unknown>>;
export type OptionsType = {
  basePixelValue?: number;
  keys: Array<string>;
};
const predicateKey = (input: InputDataType[0], key: string) => {
  const ref = has(input, key) ? key : has(input, `value.${key}`) ? `value.${key}` : undefined;
  return has(input, `${ref}.value`) ? `${ref}.value` : ref;
};

export async function pxToRem<T extends InputDataType>(inputData: T, options: OptionsType) {
  inputData.forEach(input => {
    options.keys.forEach(key => {
      const ref = predicateKey(input, key);
      if (!ref) return;
      let measurement = get(input, ref) as MeasurementValue;
      if (measurement && 'unit' in measurement && measurement.unit === 'px') {
        set(input, ref, convertMeasurement(measurement, 'rem', options.basePixelValue));
      }
    });
  });
  return inputData;
}
