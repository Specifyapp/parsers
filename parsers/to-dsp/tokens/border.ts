import { BorderToken } from '../../../types/tokens/Border';
import { DspEntity } from '../dsp.type';

export class Border extends BorderToken {
  constructor(token: Partial<BorderToken>) {
    super(token);
  }

  toDsp(): DspEntity {
    const { color, type, width } = this.value;
    const { measure, unit } = width.value;
    const { r, g, b, a } = color.value;

    return {
      class: 'token',
      type: 'custom',
      id: this.id!,
      name: this.name,
      value: `${measure}${unit} ${type} rgba(${r}, ${g}, ${b}, ${a})`,
      tags: ['specify', 'border'],
    };
  }
}
