import Token from './Token';
import { TokensType, VectorValue } from './index';

export class VectorToken extends Token<VectorValue> {
  type: TokensType = 'vector';
  value: VectorValue;

  constructor(element: Partial<VectorToken>) {
    super(element);
    this.value = element.value!;
  }
}
