import { BorderToken } from '../../../types';
import { BorderMapping } from '../to-tailwind.type';
import tinycolor from 'tinycolor2';
import { OptionsType } from '../to-tailwind.parser';

export class Border extends BorderToken {
  transformedName: string;
  constructor(token: Partial<BorderToken>, transformedNameFn: Function) {
    super(token);
    this.transformedName = transformedNameFn(token.name);
  }

  generate(options: OptionsType): BorderMapping {
    const { width, radii, color } = this.value;
    const result: BorderMapping = {
      borderWidth: {
        [this.transformedName]: `${width.value.measure}${width.value.unit}`,
      },
    };

    if (radii && radii.value) {
      result.borderRadius = {
        [this.transformedName]: `${radii?.value.measure}${radii?.value.unit}`,
      };
    }

    if (color && color.value) {
      result.borderColor = {
        [this.transformedName]: tinycolor(color.value).toString(
          options?.formatTokens?.colorFormat?.format || 'hex',
        ),
      };
      if (color.value.a && color.value.a !== 1) {
        result.borderOpacity = {
          [this.transformedName]: `${color.value.a}`,
        };
      }
    }

    return result;
  }
}
