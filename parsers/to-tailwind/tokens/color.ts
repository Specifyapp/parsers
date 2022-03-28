import tinycolor from 'tinycolor2';
import { ColorToken } from '../../../types/tokens/Color';
import { ColorMapping } from '../to-tailwind.type';
import { OptionsType } from '../to-tailwind.parser';
import { Utils } from './index';

export class Color extends ColorToken {
  token: Partial<ColorToken>;
  constructor(token: Partial<ColorToken>) {
    super(token);
    this.token = token;
  }
  generate(options: OptionsType): ColorMapping {
    return {
      colors: Utils.go<ConstructorParameters<typeof Color>[0]>(
        this.token,
        options,
        'colors',
        tinycolor(this.value).toString(options?.formatTokens?.colorFormat?.format || 'hex'),
      ),
    };
  }
}
