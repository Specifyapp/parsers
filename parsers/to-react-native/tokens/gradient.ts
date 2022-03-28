import tinycolor from 'tinycolor2';
import { GradientToken } from '../../../types/tokens/Gradient';
import { OptionsType } from '../to-react-native.parser';

export class Gradient extends GradientToken {
  constructor(token: Partial<GradientToken>) {
    super(token);
  }

  toReactNative({ colorFormat = 'rgb' }: OptionsType = {}) {
    const value = this.value.gradients.map(gradient => {
      const colors = gradient.colors.map(({ color }) =>
        tinycolor(color.value).toString(colorFormat),
      );
      const locations = gradient.colors.map(({ position }) => position / 100);
      const angle = parseFloat(gradient.angle.replace('deg', '')) || 0;

      return {
        angle,
        colors,
        locations,
      };
    });
    return JSON.stringify(value);
  }
}
