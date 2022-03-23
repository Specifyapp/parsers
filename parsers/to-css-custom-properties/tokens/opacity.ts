import { OpacityToken } from '../../../types';

export function toCss<T extends Pick<OpacityToken, 'value'> & object>(token: T) {
  return token.value.opacity / 100;
}
