import { LibsType } from '../global-libs';
import Template from '../../libs/template';

export type InputDataType = Array<Record<string, any>> | string;
export type OutputDataType = InputDataType;
export type OptionsType = {
  key?: string;
  prefix: string; // pattern
  applyOn?: Array<string>;
};
async function prefixBy(input:string, options:OptionsType, { _ }: Pick<LibsType, '_'>):Promise<string>;
async function prefixBy(input:Array<Record<string, any>>, options:OptionsType, { _ }: Pick<LibsType, '_'>):Promise<Array<Record<string, any>>>;
async function prefixBy (
  input: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
) {
  if (typeof input === 'string') {
    return `${options.prefix}\n\n${input}`;
  }
  const key = options.key || 'name';
  const template = new Template(options.prefix);
  return input.map(token => {
    if (!options.applyOn || (token.type && options.applyOn.includes(token.type))) {
      _.set(token, key, `${template.render(token)}${_.get(token, key)}`);
    }
    return token;
  });
}

export default prefixBy;