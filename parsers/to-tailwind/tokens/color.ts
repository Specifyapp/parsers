import tinycolor from 'tinycolor2';
import { ColorToken } from '../../../types';
import { ColorMapping } from '../to-tailwind.type';
import { OptionsType } from '../to-tailwind.parser';

export class Color extends ColorToken {
  transformedName: string;
  constructor(token: Partial<ColorToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }
  generate(options: OptionsType): ColorMapping {
    return {
      colors: {
        [this.transformedName]: tinycolor(this.value).toString(
          options?.formatTokens?.colorFormat?.format || 'hex',
        ),
      },
    };
  }
}
