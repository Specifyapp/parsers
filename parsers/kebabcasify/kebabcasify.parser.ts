import { get, has, kebabCase, set } from 'lodash';

export type InputDataType = Array<Record<string, any>>;
export type OptionsType =
  | undefined
  | {
      keys: Array<string>;
    };

export async function kebabcasify<T extends InputDataType>(
  tokens: T,
  options: OptionsType = { keys: ['name'] },
) {
  return tokens.map(token => {
    options.keys.forEach(key => {
      if (has(token, key)) {
        return set(token, key, kebabCase(get(token, key)));
      }
    });
    return token;
  });
}
