import { ShadowToken } from '../../../types';
import { DspEntity } from '../dsp.type';

export class Shadow extends ShadowToken {
  constructor(token: Partial<ShadowToken>) {
    super(token);
  }

  toDsp(): DspEntity {
    const value = this.value.reduce((acc, shadow) => {
      const { color, offsetX, offsetY, blur, isInner, spread } = shadow;
      const xString = `${offsetX.value.measure}${offsetX.value.unit}`;
      const yString = `${offsetY.value.measure}${offsetY.value.unit}`;
      const blurString = `${blur.value.measure}${blur.value.unit}`;
      const spreadString = spread ? `${spread.value.measure}${spread.value.unit}` : '';
      const { r, g, b, a } = color.value;
      const innerText = isInner ? 'inset' : '';
      if (acc === '') {
        return `${innerText} ${xString} ${yString} ${blurString} ${spreadString} rgba(${r},${g},${b},${a})`;
      }

      return `${acc}, ${innerText} ${xString} ${yString} ${blurString} ${spreadString} rgba(${r},${g},${b},${a})`;
    }, '');

    return {
      class: 'token',
      type: 'custom',
      id: this.id!,
      name: this.name,
      value,
      tags: ['specify', 'shadow'],
    };
  }
}
