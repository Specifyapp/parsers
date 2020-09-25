import { OpacityToken } from '../../../types';

export class Opacity extends OpacityToken {
  constructor(token: Partial<OpacityToken>) {
    super(token);
  }
  toCss() {
    return this.value.opacity / 100;
  }
}
