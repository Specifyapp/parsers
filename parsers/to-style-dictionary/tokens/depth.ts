import { DepthToken } from '../../../types';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import * as _ from 'lodash';
import { setDescription } from '../utils/setDescription';
import { OptionsType } from '../to-style-dictionary.parser';

export class Depth extends DepthToken {
  keys: Array<string>;

  constructor(token: Partial<DepthToken>, keys: Array<string>) {
    super(token);
    this.keys = ['depth', 'base', ...keys];
  }

  generate(options: OptionsType): Pick<BaseStyleDictionaryTokensFormat, 'depth'> {
    return _.setWith(
      {},
      this.keys,
      { value: `${this.value.depth}`, ...setDescription(this, options) },
      Object,
    );
  }
}
