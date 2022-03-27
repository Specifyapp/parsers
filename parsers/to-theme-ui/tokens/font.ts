import { FontToken } from '../../../types';
import { formatName } from './index';
import { Indexes, OptionsType } from '../to-theme-ui.parser';
import { ThemeUiFont, ThemeUiObject } from '../to-theme-ui.type';
import * as Belt from '@mobily/ts-belt';

export const generate = <T extends Pick<FontToken, 'value' | 'name' | 'id'> & object>(
  token: T,
  options: OptionsType,
  presets: ThemeUiObject,
) => {
  const name = formatName(token.name, options?.formatName);
  let result: ThemeUiFont = {
    fonts: {
      [name]: token.name,
    },
  };
  if (
    typeof options?.presets?.fontWeights?.freeze !== 'boolean' ||
    options?.presets?.fontWeights?.freeze === false
  ) {
    result = Belt.D.set(
      result,
      'fontWeights',
      Belt.D.merge(presets.fontWeights ?? {}, { [name]: token.value.fontWeight }),
    );
    Indexes.Instance.add('fontWeights', token.id, name, token.value.fontWeight);
  }
  Indexes.Instance.add('fonts', token.id, name);
  return result;
};
