import Token from './Token';
import { FontValue, TokensType } from './index';

export class FontToken extends Token<FontValue> {
  type: TokensType = 'font';
  value: FontValue;

  constructor(element: Partial<FontToken>) {
    super(element);
    this.value = element.value!;
  }
}
