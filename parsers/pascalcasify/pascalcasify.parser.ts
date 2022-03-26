import { get, has, pascalCase, set } from 'lodash';

export type InputDataType = Array<Record<string, any>>;
export type OptionsType =
  | undefined
  | {
      keys: Array<string>;
    };

export async function pascalcasify<T extends InputDataType>(
  tokens: T,
  options: OptionsType = { keys: ['name'] },
) {
  try {
    return tokens.map(token => {
      options.keys.forEach(key => {
        if (has(token, key)) {
          set(token, key, pascalCase(get(token, key)));
        }
      });
      return token;
    });
  } catch (err) {
    throw err;
  }
}
