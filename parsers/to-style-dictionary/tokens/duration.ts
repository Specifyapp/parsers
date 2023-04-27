import { DurationToken } from '../../../types';
import { OptionsType } from '../to-style-dictionary.parser';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import * as _ from 'lodash';

export class Duration extends DurationToken {
  keys: Array<string>;

  constructor(token: Partial<DurationToken>, keys: Array<string>) {
    super(token);
    this.keys = ['time', 'base', ...keys];
  }

  generate(options: OptionsType): Pick<BaseStyleDictionaryTokensFormat, 'time'> {
    const unit = options?.formatTokens?.timeAsIntegers === true ? '' : this.value.unit;
    return _.setWith(
      {},
      this.keys,
      {
        value: `${this.value.duration}${unit}`,
      },
      Object,
    );
  }
}
