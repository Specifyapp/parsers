import { MeasurementToken } from '../../../types';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import * as _ from 'lodash';
import { setDescription } from '../utils/setDescription';
import { OptionsType } from '../to-style-dictionary.parser';

export class Measurement extends MeasurementToken {
  keys: Array<string>;

  constructor(token: Partial<MeasurementToken>, keys: Array<string>) {
    super(token);
    this.keys = ['size', 'base', ...keys];
  }

  generate(options: OptionsType): Pick<BaseStyleDictionaryTokensFormat, 'size'> {
    return _.setWith(
      {},
      this.keys,
      {
        value: `${this.value.measure}${this.value.unit}`,
        ...setDescription(this, options),
      },
      Object,
    );
  }
}
