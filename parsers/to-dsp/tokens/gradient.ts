import tinycolor from 'tinycolor2';
import { DspEntity, GradientToken } from '../../../types';

export class Gradient extends GradientToken {
  constructor(token: Partial<GradientToken>) {
    super(token);
  }

  toDsp(): DspEntity {
    const value = this.value.gradients
      .map(gradient => {
        return `linear-gradient(${gradient.angle}, ${gradient.colors
          .map(({ value, position }) => `${tinycolor(value).toString('rgb')} ${position}%)`)
          .join(', ')}`;
      })
      .join(', ');

    return {
      class: 'token',
      type: 'custom',
      id: this.id!,
      name: this.name,
      value,
      tags: ['specify', 'gradient'],
    };
  }
}
