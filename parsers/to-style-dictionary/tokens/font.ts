import * as _ from 'lodash';
import { FontToken } from '../../../types';
import { OptionsType } from '../to-style-dictionary.parser';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';

export class Font extends FontToken {
  keys: Array<string>;
  constructor(token: Partial<FontToken>, keys: Array<string>) {
    super(token);
    this.keys = keys;
  }
  generate(options: OptionsType): Pick<BaseStyleDictionaryTokensFormat, 'asset'> {
    return {
      asset: {
        font: (options?.formatTokens?.fontFormat ?? ['ttf']).reduce((acc, format) => {
          const keys = [...this.keys, format];
          _.setWith(
            acc,
            keys,
            {
              value: (options?.assetsBaseDirectory?.fonts ?? '') + `${this.name}.${format}`,
            },
            Object,
          );
          return acc;
        }, {}),
      },
    };
  }
}
