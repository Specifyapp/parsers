import { DurationToken } from '../../../types';
import { formatName } from './index';
import { OptionsType } from '../to-theme-ui.parser';

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
