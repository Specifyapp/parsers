import { BitmapToken } from '../../../types';

export function toCss<T extends Pick<BitmapToken, 'value'> & object>(token: T) {
  return JSON.stringify(token.value.url);
}
