import { DepthToken } from '../../../types';
import { DspEntity } from '../dsp.type';

export class Depth extends DepthToken {
  constructor(token: Partial<DepthToken>) {
    super(token);
  }

  toDsp(): DspEntity {
    return {
      class: 'token',
      type: 'color',
      id: this.id!,
      name: this.name,
      value: `${this.value.depth}`,
      tags: ['specify', 'depth'],
    };
  }
}
