import Token from './Token';
import { BorderValue, TokensType } from './index';

export class BorderToken extends Token<BorderValue> {
  type: TokensType = 'border';
  value: BorderValue;

  constructor(element: Partial<BorderToken>) {
    super(element);
    this.value = element.value!;
  }
}
