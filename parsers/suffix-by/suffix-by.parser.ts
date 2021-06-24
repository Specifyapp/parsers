import { LibsType } from '../global-libs';
import Template from '../../libs/template';

export type InputDataType = Array<Record<string, any>>;
export type OutputDataType = InputDataType;
export type OptionsType = {
  key?: string;
  suffix: string; // pattern
  types?: Array<string>;
};

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  const key = options.key || 'name';
  const template = new Template(options.suffix);
  return tokens.map(token => {
    if (!options.types || (token.type && options.types.includes(token.type))) {
      _.set(token, key, `${_.get(token, key)}${template.render(token)}`);
    }
    return token;
  });
}
