import tinycolor from 'tinycolor2';
import { GradientToken } from '../../../types/tokens/Gradient';
import { GradientMappingBeforeWrapper } from '../to-tailwind.type';
import { Utils } from './index';
import { OptionsType } from '../to-tailwind.parser';

export class Gradient extends GradientToken {
  token: Partial<GradientToken>;
  constructor(token: Partial<GradientToken>) {
    super(token);
    this.token = token;
  }

  generate(options: OptionsType): GradientMappingBeforeWrapper {
    return {
      backgroundImage: Utils.go<ConstructorParameters<typeof GradientToken>[0]>(
        this.token,
        options,
        'backgroundImage',
        this.value.gradients
          .map(gradient => {
            return `linear-gradient(${gradient.angle}, ${gradient.colors
              .map(
                ({ color, position }) =>
                  `${tinycolor(color.value).toString(
                    options?.formatTokens?.colorFormat?.format || 'hex',
                  )} ${position}%`,
              )
              .join(', ')})`;
          })
          .join(', '),
      ),
    };
  }
}
