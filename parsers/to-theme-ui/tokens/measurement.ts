import { MeasurementToken } from '../../../types';
import { Indexes, OptionsType } from '../to-theme-ui.parser';
import { formatName, sortObject } from './index';
import { MeasurementMapping } from '../to-theme-ui.type';

interface ThemeUiSizes extends Partial<Record<MeasurementMapping, any>> {
  sizes?: Record<string, string>;
}

export const generate = <T extends Pick<MeasurementToken, 'value' | 'name' | 'id'> & object>(
  token: T,
  options: OptionsType,
) => {
  const name = formatName(token.name, options?.formatName);
  const result: ThemeUiSizes = {
    sizes: {
      [name]: `${token.value.measure}${token.value.unit}`,
    },
  };
  Indexes.Instance.add('sizes', token.id, name);
  return result;
};
export const afterGenerate = (tokens: ThemeUiSizes) => {
  tokens.sizes = sortObject(tokens.sizes!);
  return tokens;
};
