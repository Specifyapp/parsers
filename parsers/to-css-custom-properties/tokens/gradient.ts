import tinycolor from 'tinycolor2';
import { GradientToken } from '../../../types';

export function toCss<T extends Pick<GradientToken, 'value'> & object>(token: T) {
  return token.value.gradients
    .map(gradient => {
      return `linear-gradient(${gradient.angle}, ${gradient.colors
        .map(({ color, position }) => `${tinycolor(color.value).toString('rgb')} ${position}%`)
        .join(', ')})`;
    })
    .join(', ');
}
