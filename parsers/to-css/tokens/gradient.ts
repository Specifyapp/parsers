import { GradientToken } from '@specifyapp/types';
import tinycolor from 'tinycolor2';
export class Gradient extends GradientToken {
  constructor() {
    super();
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
