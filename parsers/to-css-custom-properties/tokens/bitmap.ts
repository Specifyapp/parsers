import { BitmapToken } from '../../../types';

export class Bitmap extends BitmapToken {
  constructor(token: Partial<BitmapToken>) {
    super(token);
  }

  toCss(): string {
    return JSON.stringify(this.value.url);
  }
}
