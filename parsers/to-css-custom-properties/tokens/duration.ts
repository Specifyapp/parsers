import { DurationToken } from '../../../types';

export function toCss<T extends Pick<DurationToken, 'value'> & object>(token: T) {
  const { duration, unit } = token.value;
  return `${duration}${unit}`;
}
