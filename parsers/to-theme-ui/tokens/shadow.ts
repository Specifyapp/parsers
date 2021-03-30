import { ShadowToken } from '../../../types';
import { OptionsType } from '../to-theme-ui.parser';
import tinycolor from 'tinycolor2';
import { ShadowMapping } from '../to-theme-ui.type';

interface ThemeUiShadow extends Partial<Record<ShadowMapping, any>> {
  shadows?: Record<string, string>;
}

export class Shadow extends ShadowToken {
  transformedName: string;
  constructor(token: Partial<ShadowToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }
  generate(options: OptionsType): ThemeUiShadow {
    const colorFormat = options?.formatTokens?.colorFormat?.format ?? 'rgb';

    return {
      shadows: {
        [this.transformedName]: this.value
          .reduce((acc, shadow) => {
            const { color, offsetX, offsetY, blur, isInner, spread } = shadow;
            const x = `${offsetX.value.measure}${offsetX.value.unit}`;
            const y = `${offsetY.value.measure}${offsetY.value.unit}`;
            const blurString = `${blur.value.measure}${blur.value.unit}`;
            const spreadString = spread ? ` ${spread.value.measure}${spread.value.unit}` : '';
            const innerText = isInner ? 'inset ' : '';
            const colorString = tinycolor(color.value).toString(colorFormat);
            acc.push(`${innerText}${x} ${y} ${blurString}${spreadString} ${colorString}`);
            return acc;
          }, [] as Array<string>)
          .join(', '),
      },
    };
  }
}
