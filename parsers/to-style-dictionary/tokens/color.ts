import tinycolor from 'tinycolor2';
import { ColorToken } from '../../../types';
import { OptionsType } from '../to-style-dictionary.parser';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import * as _ from 'lodash';

export class Color extends ColorToken {
  keys: Array<string>;
  constructor(token: Partial<ColorToken>, keys: Array<string>) {
    super(token);
    this.keys = ['color', 'base', ...keys];
  }
  generate(options: OptionsType): Pick<BaseStyleDictionaryTokensFormat, 'color'> {
    return _.setWith(
      {},
      this.keys,
      {
        value: tinycolor(this.value).toString(options?.formatTokens?.colorFormat?.format || 'rgb'),
      },
      Object,
    );
  }
}
