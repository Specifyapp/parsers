import { tokenTypesList } from './constant';
import { TokensType } from '../types';

export function getTokenTypesToApplyFn<T extends { filter?: { types?: Array<TokensType> } }>(
  options: T,
) {
  if (!options?.filter?.types) {
    return tokenTypesList;
  }
  return tokenTypesList.filter(tokenType => options.filter!.types!.includes(tokenType));
}
