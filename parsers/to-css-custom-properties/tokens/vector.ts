import { VectorToken } from '../../../types';

export function toCss<T extends Pick<VectorToken, 'value'> & object>(token: T) {
  return JSON.stringify(token.value.url);
}
