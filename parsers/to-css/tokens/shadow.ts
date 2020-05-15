import { ShadowToken } from '@specifyapp/types';

export class Shadow extends ShadowToken {
  constructor() {
    super();
  }

  toCss() {
    const { color, offsetX, offsetY, blur, isInner } = this.value;
    const x = offsetX.value;
    const y = offsetY.value;
    const bl = blur.value;
    const { r, g, b, a } = color.value;
    const innerText = isInner ? 'inset' : '';
    return `${innerText} ${x.measure}${x.unit} ${y.measure}${y.unit} ${bl.measure}${bl.unit} rgba(${r},${g},${b},${a})`;
  }
}
