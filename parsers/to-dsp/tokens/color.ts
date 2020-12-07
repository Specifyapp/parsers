import tinycolor from 'tinycolor2';
import { ColorToken } from '../../../types';
import { DspEntity } from '../dsp.type';

export class Color extends ColorToken {
  constructor(token: Partial<ColorToken>) {
    super(token);
  }
  toDsp(): DspEntity {
    return {
      class: 'token',
      type: 'color',
      id: this.id!,
      name: this.name,
      value: tinycolor(this.value).toString('hex8'),
      tags: ['specify', 'color'],
    };
  }
}
