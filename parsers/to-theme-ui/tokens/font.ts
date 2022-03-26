import { FontToken } from '../../../types';
import { formatName, sortObject } from './index';
import { FontMapping } from '../to-theme-ui.type';
import { Indexes, OptionsType } from '../to-theme-ui.parser';

interface ThemeUiFont extends Partial<Record<FontMapping, any>> {
  fonts: Record<string, string>;
  fontWeights?: Record<string, string | number>;
}

export const generate = <T extends Pick<FontToken, 'value' | 'name' | 'id'> & object>(
  token: T,
  options: OptionsType,
) => {
  const name = formatName(token.name, options?.formatName);
  const result: ThemeUiFont = {
    fonts: {
      [name]: token.name,
    },
    fontWeights: { [name]: token.value.fontWeight },
  };
  Indexes.Instance.add('fontWeights', token.id, name, token.value.fontWeight);
  Indexes.Instance.add('fonts', token.id, name);
  return result;
};

export const afterGenerate = (tokens: ThemeUiFont) => {
  tokens.fonts = sortObject(tokens.fonts!);
  return tokens;
};
