import { LibsType } from '../global-libs';

export type InputDataType = Array<Record<string, any>>;
export type OutputDataType = InputDataType;
export type OptionsType = {
  key?: string;
  suffix: string;
  types?: Array<string>;
};

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  const key = options.key || 'name';
  return tokens.map(token => {
    if (!options.types || (token.type && options.types.includes(token.type))) {
      _.set(token, key, `${_.get(token, key)}${options.suffix}`);
    }
    return token;
  });
}
