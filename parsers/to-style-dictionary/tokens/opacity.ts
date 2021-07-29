import { OpacityToken } from '../../../types';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import * as _ from 'lodash';

export class Opacity extends OpacityToken {
  keys: Array<string>;

  constructor(token: Partial<OpacityToken>, keys: Array<string>) {
    super(token);
    this.keys = ['opacity', 'base', ...keys];
  }

  generate(): Pick<BaseStyleDictionaryTokensFormat, 'opacity'> {
    return _.setWith(
      {},
      this.keys,
      {
        value: `${this.value.opacity / 100}`,
      },
      Object,
    );
  }
}
