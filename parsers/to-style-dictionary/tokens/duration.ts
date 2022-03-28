import { DurationToken } from '../../../types/tokens/Duration';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import * as _ from 'lodash';

export class Duration extends DurationToken {
  keys: Array<string>;

  constructor(token: Partial<DurationToken>, keys: Array<string>) {
    super(token);
    this.keys = ['time', 'base', ...keys];
  }

  generate(): Pick<BaseStyleDictionaryTokensFormat, 'time'> {
    return _.setWith(
      {},
      this.keys,
      {
        value: `${this.value.duration}${this.value.unit}`,
      },
      Object,
    );
  }
}
