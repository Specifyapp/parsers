import tinycolor from 'tinycolor2';
import { ColorToken } from '../../../types';
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
    const colorFormat = options?.formatTokens?.colorFormat?.format ?? 'hex';
    return {
      colors: Utils.go<ConstructorParameters<typeof Color>[0]>(
        this.token,
        options,
        'colors',
        colorFormat === 'raw' ? this.value : tinycolor(this.value).toString(colorFormat),
      ),
    };
  }
}
