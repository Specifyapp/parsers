import { TokensType } from '../../types';
import _ from 'lodash';
import { getTokenTypesToApplyFn } from '../../libs/apply-on-types';

export type InputDataType = Array<object & { type?: TokensType }>;
export type OptionsType<T> = {
  keys: Array<keyof T>;
  filter?: {
    types: Array<TokensType>;
  };
  flatten?: boolean;
};

const flattenObject = (obj: Record<string, any>) => {
  const flattened: Record<string, any> = {};

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]));
    } else {
      flattened[key] = obj[key];
    }
  });

  return flattened;
};

export default async function pick<T extends InputDataType>(tokens: T, options: OptionsType<T[0]>) {
  try {
    const typesToApplyFn = getTokenTypesToApplyFn(options);
    return tokens.map<T[0]>(token => {
      if ('type' in token && typesToApplyFn.includes(token.type!)) {
        const obj = _.pick(token, ...options.keys);
        return options.flatten ? flattenObject(obj) : obj;
      }
      return token;
    });
  } catch (err) {
    throw err;
  }
}
