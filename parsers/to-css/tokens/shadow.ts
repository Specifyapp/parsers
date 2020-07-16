import { ShadowToken } from '@specifyapp/types';

export class Shadow extends ShadowToken {
  constructor() {
    super();
  }

  toCss() {
    return this.value.reduce((acc, shadow) => {
      const { color, offsetX, offsetY, blur, isInner } = shadow;
      const x = offsetX.value;
      const y = offsetY.value;
      const bl = blur.value;
      const { r, g, b, a } = color.value;
      const innerText = isInner ? 'inset' : '';
      if (acc === '') {
        return `${innerText} ${x.measure}${x.unit} ${y.measure}${y.unit} ${bl.measure}${bl.unit} rgba(${r},${g},${b},${a})`;
      }

      return `${acc}, ${innerText} ${x.measure}${x.unit} ${y.measure}${y.unit} ${bl.measure}${bl.unit} rgba(${r},${g},${b},${a})`;
    }, '');
  }
}
