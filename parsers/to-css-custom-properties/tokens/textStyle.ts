import { TextStyleToken } from '@specifyapp/types';

export class TextStyle extends TextStyleToken {
  constructor(token: Partial<TextStyleToken>) {
    super(token);
  }
  toCss() {
    const { font, color, size } = this.value;
    const { r, g, b, a } = color.value;
    const { fontPostScriptName } = font.value;
    const { measure, unit } = size.value;
    return `${fontPostScriptName} ${measure}${unit} rgba(${r}, ${g}, ${b}, ${a})`;
  }
}
