import { LibsType } from '../global-libs';

export type InputDataType = Record<string, any>;
export type OutputDataType = InputDataType;
export type OptionsType =
  | undefined
  | {
      keys: Array<string>;
    };

export default async function (
  tokens: InputDataType,
  options: OptionsType = { keys: ['name'] },
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  return _.sortBy(tokens, options.keys);
}
