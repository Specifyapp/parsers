import * as _ from 'lodash';
import { VectorToken } from '../../../types/tokens/Vector';
import { OptionsType } from '../to-style-dictionary.parser';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';

export class Vector extends VectorToken {
  keys: Array<string>;
  constructor(token: Partial<VectorToken>, keys: Array<string>) {
    super(token);
    this.keys = ['asset', 'icon', ...keys];
  }
  generate(options: OptionsType): Pick<BaseStyleDictionaryTokensFormat, 'asset'> {
    return _.setWith(
      {},
      this.keys,
      {
        value: (options?.assetsBaseDirectory?.icons ?? '') + `${this.name}.${this.value.format}`,
      },
      Object,
    );
  }
}
