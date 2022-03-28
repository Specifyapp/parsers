import { DurationToken } from '../../../types/tokens/Duration';

export function toCss<T extends Pick<DurationToken, 'value'> & object>(token: T) {
  const { duration, unit } = token.value;
  return `${duration}${unit}`;
}
