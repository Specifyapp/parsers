import { Token, AllowedFieldsWithType } from '../../types';
import libs from '../global-libs';

type listAllowedFields = Exclude<AllowedFieldsWithType<Token, string>, undefined>;

export type InputDataType = Array<Partial<Pick<Token, listAllowedFields>>>;
export type OutputDataType = Promise<InputDataType>;
export type OptionsType = {
  key?: listAllowedFields;
  suffix: string;
  types?: Array<string>;
};

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: typeof libs,
): OutputDataType {
  const key = options.key || 'name';
  return tokens.map(token => {
    if (!options.types || (token.type && options.types.includes(token.type))) {
      token[key] = `${token[key]}${options.suffix}`;
    }
    return token;
  });
}
