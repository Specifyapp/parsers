import { BorderToken } from '../../../types';

export class Border extends BorderToken {
  constructor(token: Partial<BorderToken>) {
    super(token);
  }

  toScss() {
    const { color, type, width } = this.value;
    const { measure, unit } = width.value;
    const { r, g, b, a } = color.value;
    return `${measure}${unit} ${type.toLowerCase()} rgba(${r}, ${g}, ${b}, ${a})`;
  }
}
