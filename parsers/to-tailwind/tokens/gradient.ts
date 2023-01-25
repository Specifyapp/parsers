import tinycolor from 'tinycolor2';
import { GradientToken } from '../../../types';
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
    const colorFormat = options?.formatTokens?.colorFormat?.format ?? 'hex';

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
                  `${
                    colorFormat === 'raw'
                      ? color.value
                      : tinycolor(color.value).toString(colorFormat)
                  } ${position}%`,
              )
              .join(', ')})`;
          })
          .join(', '),
      ),
    };
  }
}
