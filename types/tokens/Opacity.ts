import Token from './Token';
import { OpacityValue, TokensType } from './index';

export class OpacityToken extends Token<OpacityValue> {
  type: TokensType = 'opacity';
  value: OpacityValue;

  constructor(element: Partial<OpacityToken>) {
    super(element);
    this.value = element.value!;
  }
}
