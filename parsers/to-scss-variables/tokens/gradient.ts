import tinycolor from 'tinycolor2';
import { GradientToken } from '../../../types';

export class Gradient extends GradientToken {
  constructor(token: Partial<GradientToken>) {
    super(token);
  }

  toScss() {
    return this.value.gradients
      .map(gradient => {
        return `linear-gradient(${gradient.angle}, ${gradient.colors
          .map(({ color, position }) => `${tinycolor(color.value).toString('rgb')} ${position}%`)
          .join(', ')})`;
      })
      .join(', ');
  }
}
