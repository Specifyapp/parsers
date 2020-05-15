import { OpacityToken } from '@specifyapp/types';

export class Opacity extends OpacityToken {
  constructor() {
    super();
  }

  toCss() {
    return this.value.opacity / 100;
  }
}
