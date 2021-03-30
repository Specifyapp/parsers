import tinycolor from 'tinycolor2';
import { Indexes, OptionsType } from '../to-theme-ui.parser';
import { ColorToken } from '../../../types';
import { ColorMapping } from '../to-theme-ui.type';

interface ThemeUiColor extends Partial<Record<ColorMapping, any>> {
  colors: Record<string, string>;
}

export class Color extends ColorToken {
  transformedName: string;
  constructor(token: Partial<ColorToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }
  generate(options: OptionsType): ThemeUiColor {
    const result = {
      colors: {
        [this.transformedName]: tinycolor(this.value).toString(
          options?.formatTokens?.colorFormat?.format || 'rgb',
        ),
      },
    };
    Indexes.Instance.add('colors', this.id, this.transformedName);
    return result;
  }
}
