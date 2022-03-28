import { TokensType } from '../../types';
import { getTokenTypesToApplyFn } from '../../libs/apply-on-types';
import _ from 'lodash';
import { flattenObject } from '../../libs/flatten-deep';

export type InputDataType = Array<Record<string, any>>;
export type OptionsType = {
  keys: Array<string>;
  filter?: {
    types: Array<TokensType>;
  };
  flatten?: boolean;
};

export async function omit<T extends InputDataType>(tokens: T, options: OptionsType) {
  const typesToApplyFn = getTokenTypesToApplyFn(options);
  return tokens.map<T[0]>(token => {
    if ('type' in token && typesToApplyFn.includes(token.type!)) {
      const obj = _.omit(token, options.keys);
      return options.flatten ? flattenObject(obj) : obj;
    }
    return token;
  });
}
