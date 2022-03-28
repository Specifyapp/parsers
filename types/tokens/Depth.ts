import Token from './Token';
import { DepthValue, TokensType } from './index';

export class DepthToken extends Token<DepthValue> {
  type: TokensType = 'depth';
  value: DepthValue;

  constructor(element: Partial<DepthToken>) {
    super(element);
    this.value = element.value!;
  }
}
