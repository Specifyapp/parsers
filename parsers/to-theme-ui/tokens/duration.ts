import { DurationToken } from '../../../types';
import { formatName, sortObject } from './index';
import { DurationMapping } from '../to-theme-ui.type';
import { OptionsType } from '../to-theme-ui.parser';

interface ThemeUiDuration extends Partial<Record<DurationMapping, any>> {
  durations: Record<string, number | string>;
}

export const generate = <T extends Pick<DurationToken, 'value' | 'name' | 'id'> & object>(
  token: T,
  options: OptionsType,
) => {
  const name = formatName(token.name, options?.formatName);
  return {
    durations: {
      [name]: `${token.value.duration}${token.value.unit}`,
    },
  };
};

export const afterGenerate = (tokens: ThemeUiDuration) => {
  tokens.durations = sortObject(tokens.durations);
  return tokens;
};
