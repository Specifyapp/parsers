import { BorderToken } from '../../../types';
import { BorderMapping } from '../to-tailwind.type';
import tinycolor from 'tinycolor2';
import { OptionsType } from '../to-tailwind.parser';
import { Utils } from './index';

export class Border extends BorderToken {
  token: Partial<BorderToken>;
  constructor(token: Partial<BorderToken>, transformNameFn: Function) {
    super(token);
    this.token = { ...token, name: transformNameFn(token.name) };
  }

  generate(options: OptionsType): BorderMapping {
    const { width, radii, color } = this.value;
    const result = {} as BorderMapping;

    if (width && width.value) {
      const keyName = Utils.getTemplatedTokenName(this.token, options?.renameKeys?.borderWidth);
      result.borderWidth = {
        [keyName]: `${width.value.measure}${width.value.unit}`,
      };
    }

    if (radii && radii.value) {
      const keyName = Utils.getTemplatedTokenName(this.token, options?.renameKeys?.borderRadius);
      result.borderRadius = {
        [keyName]: `${radii?.value.measure}${radii?.value.unit}`,
      };
    }

    if (color && color.value) {
      const keyName = Utils.getTemplatedTokenName(this.token, options?.renameKeys?.borderColor);
      result.borderColor = {
        [keyName]: tinycolor(color.value).toString(
          options?.formatTokens?.colorFormat?.format || 'hex',
        ),
      };
      if (color.value.a && color.value.a !== 1) {
        const keyName = Utils.getTemplatedTokenName(this.token, options?.renameKeys?.borderOpacity);
        result.borderOpacity = {
          [keyName]: `${color.value.a}`,
        };
      }
    }

    return result;
  }
}
