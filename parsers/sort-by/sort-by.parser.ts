import { sortBy as sortByLodash } from 'lodash';

export type InputDataType = Record<string, any>;
export type OptionsType =
  | undefined
  | {
      keys: Array<string>;
    };

export async function sortBy<T extends InputDataType>(
  tokens: T,
  options: OptionsType = { keys: ['name'] },
) {
  return sortByLodash(tokens, options.keys);
}
