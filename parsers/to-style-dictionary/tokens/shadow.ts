import { ShadowToken } from '../../../types/tokens/Shadow';
import tinycolor from 'tinycolor2';
import { BaseStyleDictionaryTokensFormat } from '../to-style-dictionary.type';
import { OptionsType } from '../to-style-dictionary.parser';
import * as _ from 'lodash';

export class Shadow extends ShadowToken {
  keys: Array<string>;
  constructor(token: Partial<ShadowToken>, keys: Array<string>) {
    super(token);
    this.keys = keys;
  }
  generate(options: OptionsType): Pick<BaseStyleDictionaryTokensFormat, 'color' | 'size'> {
    const colorFormat = options?.formatTokens?.colorFormat?.format ?? 'rgb';

    return {
      color: {
        shadow: this.value.reduce<NonNullable<BaseStyleDictionaryTokensFormat['color']>>(
          (acc, shadow, index) => {
            const keys = [...this.keys, `${index}`];
            _.setWith(
              acc,
              keys,
              {
                value: tinycolor(shadow.color.value).toString(colorFormat),
              },
              Object,
            );
            return acc;
          },
          {},
        ),
      },
      size: {
        shadow: this.value.reduce<NonNullable<BaseStyleDictionaryTokensFormat['size']>>(
          (acc, shadow, index) => {
            const keys = [...this.keys, `${index}`];

            if (shadow.offsetX.value.measure !== 0) {
              _.setWith(
                acc,
                [...keys, 'offsetX'],
                {
                  value: `${shadow.offsetX.value.measure}${shadow.offsetX.value.unit}`,
                },
                Object,
              );
            }
            if (shadow.offsetY.value.measure !== 0) {
              _.setWith(
                acc,
                [...keys, 'offsetY'],
                {
                  value: `${shadow.offsetY.value.measure}${shadow.offsetY.value.unit}`,
                },
                Object,
              );
            }
            if (shadow.blur.value.measure !== 0) {
              _.setWith(
                acc,
                [...keys, 'blur'],
                {
                  value: `${shadow.blur.value.measure}${shadow.blur.value.unit}`,
                },
                Object,
              );
            }

            if (shadow.spread) {
              _.setWith(
                acc,
                [...keys, 'spread'],
                {
                  value: `${shadow.spread.value.measure}${shadow.spread.value.unit}`,
                },
                Object,
              );
            }

            return acc;
          },
          {},
        ),
      },
    };
  }
}
