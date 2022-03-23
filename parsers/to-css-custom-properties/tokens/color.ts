import tinycolor from 'tinycolor2';
import { OptionsType } from '../to-css-custom-properties.parser';
import { ColorToken, ColorValue } from '../../../types';

export function toCss<T extends Pick<ColorToken, 'value'> & object>(
  token: T,
  options: OptionsType,
) {
  return tinycolor(token.value).toString(options?.formatTokens?.color || 'rgb');
}
