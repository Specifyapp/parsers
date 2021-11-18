import tinycolor from 'tinycolor2';
import { ColorToken } from '../../../types';
import { ColorMapping } from '../to-tailwind.type';
import { OptionsType } from '../to-tailwind.parser';
import { Utils } from './index';

export class Color extends ColorToken {
  token: Partial<ColorToken>;
  constructor(token: Partial<ColorToken>, transformNameFn: Function) {
    super(token);
    this.token = { ...token, name: transformNameFn(token.name) };
  }
  generate(options: OptionsType): ColorMapping {
    const keyName = Utils.getTemplatedTokenName(this.token, options?.renameKeys?.colors);
    return {
      colors: {
        [keyName]: tinycolor(this.value).toString(
          options?.formatTokens?.colorFormat?.format || 'hex',
        ),
      },
    };
  }
}
