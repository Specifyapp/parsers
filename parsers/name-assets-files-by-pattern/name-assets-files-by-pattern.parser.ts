import Template from '../../libs/template';
import { set } from 'lodash';

export type InputDataType = Array<Record<string, any>>;
export type OptionsType = {
  pattern: string;
};

export async function nameAssetsFilesByPattern<T extends InputDataType>(
  assets: T,
  options: OptionsType,
) {
  const template = new Template(options.pattern);
  return assets.map(asset => set(asset, 'value.fileName', template.render(asset)));
}
