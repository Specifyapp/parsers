import tinycolor from 'tinycolor2';
import { GradientToken } from '../../../types';

export class Gradient extends GradientToken {
  constructor(token: Partial<GradientToken>) {
    super(token);
  }

  toCss() {
    const value = this.value.gradients
      .map(gradient => {
        return `linear-gradient(${gradient.angle}, ${gradient.colors
          .map(({ value, position }) => `${tinycolor(value).toString('rgb')} ${position}%)`)
          .join(', ')}`;
      })
      .join(', ');
    return value;
  }
}
