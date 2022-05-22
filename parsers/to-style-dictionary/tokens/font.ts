import Path from 'path';
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
          const path = [...this.keys, format];
          _.setWith(
            acc,
            path,
            {
              value: Path.join(options?.assetsBaseDirectory?.fonts ?? '', `${this.name}.${format}`),
            },
            Object,
          );
          return acc;
        }, {}),
      },
    };
  }
}
