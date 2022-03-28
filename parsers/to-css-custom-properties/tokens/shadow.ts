import { ShadowToken } from '../../../types/tokens/Shadow';

export function toCss<T extends Pick<ShadowToken, 'value'> & object>(token: T) {
  return token.value.reduce((acc, shadow) => {
    const { color, offsetX, offsetY, blur, isInner, spread } = shadow;
    const xString = `${offsetX.value.measure}${offsetX.value.unit}`;
    const yString = `${offsetY.value.measure}${offsetY.value.unit}`;
    const blurString = `${blur.value.measure}${blur.value.unit}`;
    // Intial space in the string to avoid having double space
    const spreadString = spread ? ` ${spread.value.measure}${spread.value.unit}` : '';
    const { r, g, b, a } = color.value;
    const innerText = isInner ? 'inset ' : '';
    if (acc === '') {
      return `${innerText}${xString} ${yString} ${blurString}${spreadString} rgba(${r},${g},${b},${a})`;
    }

    return `${acc}, ${innerText}${xString} ${yString} ${blurString}${spreadString} rgba(${r},${g},${b},${a})`;
  }, '');
}
