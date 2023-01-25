import { BorderToken } from '../../../types';
import { BorderMapping } from '../to-tailwind.type';
import tinycolor from 'tinycolor2';
import { OptionsType } from '../to-tailwind.parser';
import { Utils } from './index';

export class Border extends BorderToken {
  token: Partial<BorderToken>;
  constructor(token: Partial<BorderToken>) {
    super(token);
    this.token = token;
  }

  generate(options: OptionsType): BorderMapping {
    const { width, radii, color } = this.value;
    const result = {} as BorderMapping;

    if (width && width.value) {
      result.borderWidth = Utils.go<ConstructorParameters<typeof BorderToken>[0]>(
        this.token,
        options,
        'borderWidth',
        `${width.value.measure}${width.value.unit}`,
      );
    }

    if (radii && radii.value) {
      result.borderRadius = Utils.go<ConstructorParameters<typeof BorderToken>[0]>(
        this.token,
        options,
        'borderRadius',
        `${radii?.value.measure}${radii?.value.unit}`,
      );
    }

    if (color && color.value) {
      const colorFormat = options?.formatTokens?.colorFormat?.format ?? 'hex';

      result.borderColor = Utils.go<ConstructorParameters<typeof BorderToken>[0]>(
        this.token,
        options,
        'borderColor',
        colorFormat === 'raw' ? color.value : tinycolor(color.value).toString(colorFormat),
      );
      if (color.value.a && color.value.a !== 1) {
        result.borderOpacity = Utils.go<ConstructorParameters<typeof BorderToken>[0]>(
          this.token,
          options,
          'borderOpacity',
          `${color.value.a}`,
        );
      }
    }

    return result;
  }
}
