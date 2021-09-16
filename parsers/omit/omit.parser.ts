import { LibsType } from '../global-libs';
import { TokensType } from '../../types';

export type InputDataType = Array<Record<string, any>>;
export type OutputDataType = InputDataType;
export type OptionsType =
  | undefined
  | {
      keys: Array<string>;
      filter?: {
        types: Array<TokensType>;
      };
      flatten?: boolean;
    };

const flattenObject = (obj: Record<string, any>) => {
  const flattened: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]));
    } else {
      flattened[key] = obj[key];
    }
  });

  return flattened;
};

export default async function (
  tokens: InputDataType,
  options: OptionsType = { keys: [] },
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  return tokens.map(token => {
    if (
      !options?.filter ||
      (options?.filter?.types &&
        options.filter.types.length &&
        options.filter!.types.includes(token.type))
    ) {
      const obj = _.omit(token, options.keys);
      return options.flatten ? flattenObject(obj) : obj;
    }
    return token;
  });
}
