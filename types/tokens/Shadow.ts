import Token from './Token';
import { ShadowValue, TokensType } from './index';

export class ShadowToken extends Token<ShadowValue> {
  type: TokensType = 'shadow';
  value: ShadowValue;

  constructor(element: Partial<ShadowToken>) {
    super(element);
    this.value = element.value!;
  }
}
