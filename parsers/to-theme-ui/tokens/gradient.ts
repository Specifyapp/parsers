import tinycolor from 'tinycolor2';
import { GradientToken } from '../../../types';
import { GradientMapping } from '../to-theme-ui.type';
import { OptionsType } from '../to-theme-ui.parser';
import { formatName } from './index';

interface ThemeUiGradient extends Partial<Record<GradientMapping, any>> {
  gradients?: Record<string, string>;
}

export const generate = <T extends Pick<GradientToken, 'value' | 'name' | 'id'> & object>(
  token: T,
  options: OptionsType,
) => {
  const name = formatName(token.name, options?.formatName);
  return {
    gradients: {
      [name]: token.value.gradients
        .map(gradient => {
          return `linear-gradient(${gradient.angle}, ${gradient.colors
            .map(({ color, position }) => `${tinycolor(color.value).toString('rgb')} ${position}%`)
            .join(', ')})`;
        })
        .join(', '),
    },
  };
};
