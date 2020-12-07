import { LibsType } from '../global-libs';
import convertMeasurement from '../../libs/size-manipulation';
import { MeasurementValue } from '../../types';
import _ from 'lodash';

export type InputDataType = Array<Record<string, unknown>>;
export type OutputDataType = InputDataType;
export type OptionsType = {
  baseFontSize?: number;
  keys: Array<string>;
};

const predicateKey = (input: InputDataType[0], key: string) => {
  const ref = _.has(input, key) ? key : _.has(input, `value.${key}`) ? `value.${key}` : undefined;
  return _.has(input, `${ref}.value`) ? `${ref}.value` : ref;
};

export default async function (
  inputData: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType | Error> {
  inputData.forEach(input => {
    options.keys.forEach(key => {
      const ref = predicateKey(input, key);
      if (!ref) return;
      let measurement = _.get(input, ref) as MeasurementValue;
      if (measurement && 'unit' in measurement && measurement.unit === 'px') {
        _.set(input, ref, convertMeasurement(measurement, 'rem', options.baseFontSize));
      }
    });
  });
  return inputData;
}
