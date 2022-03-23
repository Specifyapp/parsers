import { MeasurementToken } from '../../../types';

export function toCss<T extends Pick<MeasurementToken, 'value'> & object>(token: T) {
  return `${token.value.measure}${token.value.unit}`;
}
