import { BorderToken } from '@specifyapp/types';

export class Border extends BorderToken {
  constructor() {
    super();
  }

  toCss() {
    const { color, type, width } = this.value;
    const { measure, unit } = width.value;
    const { r, g, b, a } = color.value;
    return `${measure}${unit} ${type} rgba(${r}, ${g}, ${b}, ${a})`;
  }
}
