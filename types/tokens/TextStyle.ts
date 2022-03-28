import Token from './Token';
import { TextStyleValue, TokensType } from './index';

export class TextStyleToken extends Token<TextStyleValue> {
  type: TokensType = 'textStyle';
  value: TextStyleValue;

  constructor(element: Partial<TextStyleToken>) {
    super(element);
    this.value = element.value!;
  }
}
