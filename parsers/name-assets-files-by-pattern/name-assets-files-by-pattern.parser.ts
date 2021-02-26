import { LibsType } from '../global-libs';
import Template from '../../libs/template';

export type InputDataType = Array<Record<string, any>>;
export type OutputDataType = InputDataType;
export type OptionsType = {
  pattern: string;
};

export default async function (
  assets: InputDataType,
  options: OptionsType,
  libs: Pick<LibsType, 'Mustache' | '_'>,
): Promise<OutputDataType> {
  try {
    const template = new Template(options.pattern);
    return assets.map(asset => libs._.set(asset, 'value.fileName', template.render(asset)));
  } catch (err) {
    throw err;
  }
}
