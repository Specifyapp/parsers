import { ShadowToken } from '../../../types';
import { OptionsType } from '../to-tailwind.parser';
import tinycolor from 'tinycolor2';
import { ShadowMapping } from '../to-tailwind.type';
import { Utils } from './index';

export class Shadow extends ShadowToken {
  token: Partial<ShadowToken>;
  constructor(token: Partial<ShadowToken>, transformNameFn: Function) {
    super(token);
    this.token = { ...token, name: transformNameFn(token.name) };
  }
  generate(options: OptionsType): ShadowMapping {
    const colorFormat = options?.formatTokens?.colorFormat?.format ?? 'hex';
    const keyName = Utils.getTemplatedTokenName(this.token, options?.renameKeys?.boxShadow);

    return {
      boxShadow: {
        [keyName]: this.value
          .reduce<Array<string>>((acc, shadow) => {
            const { color, offsetX, offsetY, blur, isInner, spread } = shadow;
            const x = `${offsetX.value.measure}${offsetX.value.unit}`;
            const y = `${offsetY.value.measure}${offsetY.value.unit}`;
            const blurString = `${blur.value.measure}${blur.value.unit}`;
            const spreadString = spread ? ` ${spread.value.measure}${spread.value.unit}` : '';
            const innerText = isInner ? 'inset ' : '';
            const colorString = tinycolor(color.value).toString(colorFormat);
            acc.push(`${innerText}${x} ${y} ${blurString}${spreadString} ${colorString}`);
            return acc;
          }, [])
          .join(', '),
      },
    };
  }
}
