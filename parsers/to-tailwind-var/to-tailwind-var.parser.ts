import { LibsType } from '../global-libs';
import { TokensType } from '../../types';
import _ from 'lodash';
import { FormatName } from '../to-tailwind/to-tailwind.type';

export type InputDataType = Array<Record<string, any>>;
export type OutputDataType = InputDataType;
export type OptionsType = {
  formatName?: FormatName;
  filter?: {
    types: Array<TokensType>;
  };
};

const predicateKey = (input: InputDataType[0], key: string) => {
  const ref = _.has(input, key) ? key : _.has(input, `value.${key}`) ? `value.${key}` : undefined;
  return _.has(input, `${ref}.value`) ? `${ref}.value` : ref;
};

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType | Error> {
  return tokens.map(token => {
    if (
      !options?.filter ||
      (options?.filter?.types &&
        options.filter.types.length &&
        options.filter!.types.includes(token.type))
    ) {
      const ref = predicateKey(token, 'value');
      if (!ref) return token;

      let value = _.get(token, ref);

      if (value) {
        const tokenName = options?.formatName ? _[options?.formatName](token.name) : token.name;
        _.set(token, ref, `var(--${tokenName})`);
      }
    }

    return token;
  });
}
