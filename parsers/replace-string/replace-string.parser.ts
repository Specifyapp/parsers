import { LibsType } from '../global-libs';
import listPathsByPattern from '../../libs/list-paths-by-pattern';

export type InputDataType = string | Array<Record<string, any>>;
export type OutputDataType = InputDataType;
export type OptionsType = {
  keys?: Array<string>;
  regex:
    | {
        pattern: string;
        flags?: string; // d g i m s u y
      }
    | string;
  replaceBy?: string;
  trim?: boolean;
};

async function replaceString(
  input: string,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<string>;
async function replaceString(
  input: Array<Record<string, any>>,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<Array<Record<string, any>>>;
async function replaceString(
  input: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<string | Array<Record<string, any>>> {
  const reg =
    typeof options.regex === 'object'
      ? new RegExp(options.regex.pattern, options.regex.flags || '')
      : new RegExp(options.regex);

  if (typeof input === 'string') {
    const result = input.replace(reg, options.replaceBy || '');
    return options.trim ? result.trim() : result;
  } else {
    return input.map(token => {
      options.keys!.forEach(pattern => {
        const paths = listPathsByPattern(token, pattern);
        paths.forEach(selector => {
          const newValue = _.get(token, selector).replace(reg, options.replaceBy || '');
          _.set(token, selector, options.trim ? newValue.trim() : newValue);
        });
      });
      return token;
    });
  }
}

export default replaceString;
