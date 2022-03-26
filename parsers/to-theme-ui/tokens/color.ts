import tinycolor from 'tinycolor2';
import { Indexes, OptionsType } from '../to-theme-ui.parser';
import { ColorToken } from '../../../types';
import { formatName } from './index';
import { ColorMapping } from '../to-theme-ui.type';

interface ThemeUiColor extends Partial<Record<ColorMapping, any>> {
  colors: Record<string, string>;
}

export const generate = <T extends Pick<ColorToken, 'value' | 'name' | 'id'> & object>(
  token: T,
  options: OptionsType,
) => {
  const name = formatName(token.name, options?.formatName);
  const result: ThemeUiColor = {
    colors: {
      [name]: tinycolor(token.value).toString(options?.formatTokens?.colorFormat?.format || 'rgb'),
    },
  };
  Indexes.Instance.add('colors', token.id, name);
  return result;
};
