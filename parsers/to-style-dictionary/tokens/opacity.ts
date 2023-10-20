import { OpacityToken } from '../../../types';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import * as _ from 'lodash';
import { setDescription } from '../utils/setDescription';
import { OptionsType } from '../to-style-dictionary.parser';

export class Opacity extends OpacityToken {
  keys: Array<string>;

  constructor(token: Partial<OpacityToken>, keys: Array<string>) {
    super(token);
    this.keys = ['opacity', 'base', ...keys];
  }

  generate(options: OptionsType): Pick<BaseStyleDictionaryTokensFormat, 'opacity'> {
    return _.setWith(
      {},
      this.keys,
      {
        value: `${this.value.opacity / 100}`,
        ...setDescription(this, options),
      },
      Object,
    );
  }
}
