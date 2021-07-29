import * as _ from 'lodash';
import { BitmapToken } from '../../../types';
import { OptionsType } from '../to-style-dictionary';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';

export class Bitmap extends BitmapToken {
  keys: Array<string>;
  constructor(token: Partial<BitmapToken>, keys: Array<string>) {
    super(token);
    this.keys = ['asset', 'image', ...keys];
  }
  generate(options: OptionsType): Pick<BaseStyleDictionaryTokensFormat, 'asset'> {
    return _.setWith(
      {},
      this.keys,
      {
        value:
          options?.assetsBaseDirectory?.images ??
          '' + `${this.name}@${this.value.dimension ?? 1}.${this.value.format}`,
      },
      Object,
    );
  }
}
