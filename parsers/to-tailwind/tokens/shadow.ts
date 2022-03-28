import { ShadowToken } from '../../../types/tokens/Shadow';
import { OptionsType } from '../to-tailwind.parser';
import tinycolor from 'tinycolor2';
import { ShadowMapping } from '../to-tailwind.type';
import { Utils } from './index';

export class Shadow extends ShadowToken {
  token: Partial<ShadowToken>;
  constructor(token: Partial<ShadowToken>) {
    super(token);
    this.token = token;
  }
  generate(options: OptionsType): ShadowMapping {
    return {
      boxShadow: Utils.go<ConstructorParameters<typeof ShadowToken>[0]>(
        this.token,
        options,
        'boxShadow',
        this.value
          .reduce<Array<string>>((acc, shadow) => {
            const { color, offsetX, offsetY, blur, isInner, spread } = shadow;
            const x = `${offsetX.value.measure}${offsetX.value.unit}`;
            const y = `${offsetY.value.measure}${offsetY.value.unit}`;
            const blurString = `${blur.value.measure}${blur.value.unit}`;
            const spreadString = spread ? ` ${spread.value.measure}${spread.value.unit}` : '';
            const innerText = isInner ? 'inset ' : '';
            const colorString = tinycolor(color.value).toString(
              options?.formatTokens?.colorFormat?.format ?? 'hex',
            );
            acc.push(`${innerText}${x} ${y} ${blurString}${spreadString} ${colorString}`);
            return acc;
          }, [])
          .join(', '),
      ),
    };
  }
}
