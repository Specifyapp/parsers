import listPathsByPattern from '../../libs/list-paths-by-pattern';
import { get, set } from 'lodash';

export type InputDataType = Array<Record<string, any>>;
export type OptionsType = {
  keys: Array<string>;
  regex:
    | {
        pattern: string;
        flags?: string; // d g i m s u y
      }
    | string;
  replaceBy?: string;
  trim?: boolean;
};

export async function replaceString<T extends InputDataType>(tokens: T, options: OptionsType) {
  const reg =
    typeof options.regex === 'object'
      ? new RegExp(options.regex.pattern, options.regex.flags || '')
      : new RegExp(options.regex);
  return tokens.map(token => {
    options.keys.forEach(pattern => {
      const paths = listPathsByPattern(token, pattern);
      paths.forEach(selector => {
        const newValue = get(token, selector).replace(reg, options.replaceBy || '');
        set(token, selector, options.trim ? newValue.trim() : newValue);
      });
    });
    return token;
  });
}
