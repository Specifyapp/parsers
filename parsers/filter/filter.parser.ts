import { get } from 'lodash';

export type InputDataType = Array<Record<string, any>>;
export type OptionsType = {
  key: string;
  regex:
    | {
        pattern: string;
        flags?: string; // d g i m s u y
      }
    | string;
};
export async function filter<T extends InputDataType>(tokens: T, options: OptionsType) {
  try {
    const reg =
      typeof options.regex === 'object'
        ? new RegExp(options.regex.pattern, options.regex.flags || '')
        : new RegExp(options.regex);
    const result: InputDataType = [];
    tokens.forEach(token => {
      const valueToCheck = get(token, options.key);
      if (valueToCheck.match(reg)) {
        result.push(token);
      }
    });
    return result;
  } catch (error) {
    throw error;
  }
}
