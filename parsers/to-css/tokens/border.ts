import { BorderToken } from '@specifyapp/types';

export class Border extends BorderToken {
  constructor(token: Partial<BorderToken>) {
    super(token);
  }

  toCss() {
    const { color, type, width } = this.value;
    const { measure, unit } = width.value;
    const { r, g, b, a } = color.value;
    return `${measure}${unit} ${type} rgba(${r}, ${g}, ${b}, ${a})`;
  }
}
