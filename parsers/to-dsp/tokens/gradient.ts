import tinycolor from 'tinycolor2';
import { GradientToken } from '../../../types';
import { DspEntity } from '../dsp.type';

export class Gradient extends GradientToken {
  constructor(token: Partial<GradientToken>) {
    super(token);
  }

  toDsp(): DspEntity {
    const value = this.value.gradients
      .map(gradient => {
        return `linear-gradient(${gradient.angle}, ${gradient.colors
          .map(({ color, position }) => `${tinycolor(color.value).toString('rgb')} ${position}%)`)
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
