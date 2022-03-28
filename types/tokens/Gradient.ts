import Token from './Token';
import { GradientValue, TokensType } from './index';

export class GradientToken extends Token<GradientValue> {
  type: TokensType = 'gradient';
  value: GradientValue;

  constructor(element: Partial<GradientToken>) {
    super(element);
    this.value = element.value!;
  }
}
