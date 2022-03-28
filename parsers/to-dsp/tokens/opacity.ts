import { OpacityToken } from '../../../types/tokens/Opacity';
import { DspEntity } from '../dsp.type';

export class Opacity extends OpacityToken {
  constructor(token: Partial<OpacityToken>) {
    super(token);
  }
  toDsp(): DspEntity {
    return {
      class: 'token',
      type: 'custom',
      id: this.id!,
      name: this.name,
      value: `${this.value.opacity / 100}`,
      tags: ['specify', 'opacity'],
    };
  }
}
