import { DepthToken } from '../../../types';
import { DepthMapping } from '../to-theme-ui.type';
import { formatName, sortObject } from './index';
import { OptionsType } from '../to-theme-ui.parser';

interface ThemeUiDepth extends Partial<Record<DepthMapping, any>> {
  zIndices: Record<string, number>;
}

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

export const afterGenerate = (tokens: ThemeUiDepth) => {
  tokens.zIndices = sortObject(tokens.zIndices);
  return tokens;
};
