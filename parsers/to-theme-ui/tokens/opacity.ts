import { OpacityToken } from '../../../types';
import { OptionsType } from '../to-theme-ui.parser';

export const generate = <T extends Pick<OpacityToken, 'value' | 'name' | 'id'> & object>(
  token: T,
  options: OptionsType,
) => {
  let opacity: number | string = token.value.opacity;
  const opacityType = options?.formatTokens?.opacityFormat?.type || 'number';
  const opacityUnit = options?.formatTokens?.opacityFormat?.unit || 'none';
  if (opacityUnit === 'percent') {
    opacity = `${opacity}%`;
  } else if (opacityType === 'string') {
    opacity = `${opacity / 100}`;
  } else {
    opacity = opacity / 100;
  }
  return { opacities: [opacity] };
};
