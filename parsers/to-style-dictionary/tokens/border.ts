import { BorderToken } from '../../../types';
import tinycolor from 'tinycolor2';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import { OptionsType } from '../to-style-dictionary.parser';
import * as _ from 'lodash';

export class Border extends BorderToken {
  keys: Array<string>;
  constructor(token: Partial<BorderToken>, keys: Array<string>) {
    super(token);
    this.keys = keys;
  }

  generate(options: OptionsType): Pick<BaseStyleDictionaryTokensFormat, 'color' | 'size'> {
    const { width, radii, color } = this.value;

    let result = _.setWith<Pick<BaseStyleDictionaryTokensFormat, 'color' | 'size'>>(
      {},
      ['size', 'border', ...this.keys],
      { value: `${width.value.measure}${width.value.unit}` },
      Object,
    );
    if (radii && radii.value) {
      result = _.setWith(
        result,
        ['size', 'radius', ...this.keys],
        { value: `${radii?.value.measure}${radii?.value.unit}` },
        Object,
      );
    }

    if (color && color.value) {
      if (!result.color) result.color = {};
      result = _.setWith(
        result,
        ['color', 'border', ...this.keys],
        {
          value: tinycolor(color.value).toString(
            options?.formatTokens?.colorFormat?.format || 'rgb',
          ),
        },
        Object,
      );
    }

    return result;
  }
}
