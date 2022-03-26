import { get, has, set, snakeCase } from 'lodash';

export type InputDataType = Array<Record<string, any>>;
export type OptionsType =
  | undefined
  | {
      keys: Array<string>;
    };

export async function snakecasify<T extends InputDataType>(
  tokens: T,
  options: OptionsType = { keys: ['name'] },
) {
  return tokens.map(token => {
    options.keys.forEach(key => {
      if (has(token, key)) {
        set(token, key, snakeCase(get(token, key)));
      }
    });
    return token;
  });
}
