import tinycolor from 'tinycolor2';
import { GradientToken, ColorForGradient } from '../../../types';
import { FormatTokenType } from '../to-jss.parser';

export class Gradient extends GradientToken {
  constructor(token: Partial<GradientToken>) {
    super(token);
  }

  toJss({ gradientFormat = 'string' }: FormatTokenType) {
    const getColorStop = ({value, position}: ColorForGradient) => `${tinycolor(value).toString('rgb')} ${position}%`;

    const value: string = this.value.gradients
      .map(gradient => {
        const colorStops = gradient.colors
          .map(getColorStop)
          .join(', ')
        return `linear-gradient(${gradient.angle}, ${colorStops})`;
      })
      .join(gradientFormat === 'string' ?  ', ' : "', '");
    return gradientFormat === 'string' ?  `'${value}'` : `['${value}']`;
  }
}
