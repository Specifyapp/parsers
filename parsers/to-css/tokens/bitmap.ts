import { BitmapToken } from '@specifyapp/types';

export class Bitmap extends BitmapToken {
  toCss(): string {
    return JSON.stringify(this.value.url);
  }
}
