import { LibsType } from '../global-libs';
import listPathsByPattern from '../../libs/list-paths-by-pattern';

export type InputDataType = Array<Record<string, any>>;
export type OutputDataType = InputDataType;
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

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  const reg =
    typeof options.regex === 'object'
      ? new RegExp(options.regex.pattern, options.regex.flags || '')
      : new RegExp(options.regex);
  return tokens.map(token => {
    options.keys.forEach(pattern => {
      const paths = listPathsByPattern(token, pattern);
      paths.forEach(selector => {
        const newValue = _.get(token, selector).replace(reg, options.replaceBy || '');
        _.set(token, selector, options.trim ? newValue.trim() : newValue);
      });
    });
    return token;
  });
}
