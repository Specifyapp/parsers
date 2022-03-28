import { DepthToken } from '../../../types/tokens/Depth';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import * as _ from 'lodash';

export class Depth extends DepthToken {
  keys: Array<string>;

  constructor(token: Partial<DepthToken>, keys: Array<string>) {
    super(token);
    this.keys = ['depth', 'base', ...keys];
  }

  generate(): Pick<BaseStyleDictionaryTokensFormat, 'depth'> {
    return _.setWith({}, this.keys, { value: `${this.value.depth}` }, Object);
  }
}
