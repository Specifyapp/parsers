import tinycolor from 'tinycolor2';
import { GradientToken } from '../../../types';
import { GradientMapping } from '../to-theme-ui.type';

interface ThemeUiGradient extends Partial<Record<GradientMapping, any>> {
  gradients?: Record<string, string>;
}

export class Gradient extends GradientToken {
  transformedName: string;
  constructor(token: Partial<GradientToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }

  generate(): ThemeUiGradient {
    return {
      gradients: {
        [this.transformedName]: this.value.gradients
          .map(gradient => {
            return `linear-gradient(${gradient.angle}, ${gradient.colors
              .map(
                ({ color, position }) => `${tinycolor(color.value).toString('rgb')} ${position}%`,
              )
              .join(', ')})`;
          })
          .join(', '),
      },
    };
  }
}
