import Template from '../../libs/template';
import { get, set } from 'lodash';

export type InputDataType = Array<Record<string, any>>;
export type OptionsType = {
  key?: string;
  suffix: string; // pattern
  types?: Array<string>;
};

export async function suffixBy<T extends InputDataType>(tokens: T, options: OptionsType) {
  const key = options.key || 'name';
  const template = new Template(options.suffix);
  return tokens.map(token => {
    if (!options.types || (token.type && options.types.includes(token.type))) {
      set(token, key, `${get(token, key)}${template.render(token)}`);
    }
    return token;
  });
}
