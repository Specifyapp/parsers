import tinycolor from 'tinycolor2';
import { ColorToken, DspEntity } from '../../../types';

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
