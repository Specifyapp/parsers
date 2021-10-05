import { OpacityToken } from '../../../types';

export class Opacity extends OpacityToken {
  constructor(token: Partial<OpacityToken>) {
    super(token);
  }
  toReactNative() {
    const value = this.value.opacity / 100;
    return value;
  }
}
