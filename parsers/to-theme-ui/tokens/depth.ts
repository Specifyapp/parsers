import { DepthToken } from '../../../types';
import { formatName } from './index';
import { OptionsType } from '../to-theme-ui.parser';

export const generate = <T extends Pick<DepthToken, 'value' | 'name' | 'id'> & object>(
  token: T,
  options: OptionsType,
) => {
  const name = formatName(token.name, options?.formatName);
  return {
    zIndices: {
      [name]: token.value.depth,
    },
  };
};
