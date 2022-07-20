import { LibsType } from '../global-libs';

export type InputDataType = Array<Record<string, any>>;
export type OutputDataType = InputDataType;
export type OptionsType = {
  key: string;
  regex:
    | {
        pattern: string;
        flags?: string; // d g i m s u y
      }
    | string;
};
export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType | Error> {
  try {
    const reg =
      typeof options.regex === 'object'
        ? new RegExp(options.regex.pattern, options.regex.flags || '')
        : new RegExp(options.regex);
    const result: InputDataType = [];
    tokens.forEach(token => {
      const valueToCheck = _.get(token, options.key);
      if (!!valueToCheck && String(valueToCheck).match(reg)) {
        result.push(token);
      }
    });
    return result;
  } catch (error) {
    throw error;
  }
}
