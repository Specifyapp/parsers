import { camelCase, get, set, has } from 'lodash/fp';

export type InputDataType = Array<object>;
export type OptionsType =
  | undefined
  | {
      keys: Array<string>;
    };

export default async function camelcasify<T extends InputDataType>(
  tokens: T,
  options: OptionsType = { keys: ['name'] },
) {
  try {
    return tokens.map<T[0]>(token => {
      options.keys.forEach(key => {
        if (has(key, token)) {
          set(key)(camelCase(get(key)(token)))(token);
        }
      });
      return token;
    });
  } catch (err) {
    throw err;
  }
}
