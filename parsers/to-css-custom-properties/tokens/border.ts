import { BorderToken } from '../../../types/tokens/Border';

export function toCss<T extends Pick<BorderToken, 'value'> & object>(token: T) {
  const { color, type, width } = token.value;
  const { measure, unit } = width.value;
  const { r, g, b, a } = color.value;
  return `${measure}${unit} ${type.toLowerCase()} rgba(${r}, ${g}, ${b}, ${a})`;
}
