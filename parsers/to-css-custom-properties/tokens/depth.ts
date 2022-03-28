import { DepthToken } from '../../../types/tokens/Depth';

export function toCss<T extends Pick<DepthToken, 'value'> & object>(token: T) {
  return JSON.stringify(token.value.depth);
}
