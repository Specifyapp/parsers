import { DepthToken } from '../../../types';

export function toCss<T extends Pick<DepthToken, 'value'> & object>(token: T) {
  return JSON.stringify(token.value.depth);
}
