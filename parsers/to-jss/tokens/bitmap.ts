import { BitmapToken } from '../../../types';

export class Bitmap extends BitmapToken {
  constructor(token: Partial<BitmapToken>) {
    super(token);
  }

  toJss(): string {
    return `'${this.value.url}'`;
  }
}
