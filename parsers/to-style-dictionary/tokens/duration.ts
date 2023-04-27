import { DurationToken } from '../../../types';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import * as _ from 'lodash';

export class Duration extends DurationToken {
  keys: Array<string>;

  constructor(token: Partial<DurationToken>, keys: Array<string>) {
    super(token);
    this.keys = ['time', 'base', ...keys];
  }

  private get valueInMs() {
    let value = this.value.duration;
    switch (this.value.unit) {
      case 'd':
      case 'day':
        value = this.value.duration * 24 * 60 * 60 * 1000;
        break;
      case 'h':
      case 'hour':
      case 'hours':
        value = this.value.duration * 60 * 60 * 1000;
        break;
      case 'm':
      case 'minute':
      case 'minutes':
        value = this.value.duration * 60 * 1000;
        break;
      case 's':
      case 'second':
      case 'seconds':
        value = this.value.duration * 1000;
        break;
      case 'ms':
      case 'millisecond':
      case 'milliseconds':
        break;
      default:
        throw new Error('Invalid duration unit');
    }
    return value;
  }

  generate(): Pick<BaseStyleDictionaryTokensFormat, 'time'> {
    return _.setWith(
      {},
      this.keys,
      {
        value: `${this.valueInMs}`,
      },
      Object,
    );
  }
}
