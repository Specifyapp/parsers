import Token from './Token';
import { BitmapValue, TokensType } from './index';

export class BitmapToken extends Token<BitmapValue> {
  type: TokensType = 'bitmap';
  value: BitmapValue;

  constructor(element: Partial<BitmapToken>) {
    super(element);
    this.value = element.value!;
  }
}
