import Token, { TokenInterface } from './Token';
import { TokensType } from './index';

export interface OpacityValue {
  opacity: number;
}

export class OpacityToken extends Token implements TokenInterface {
  type: TokensType = 'opacity';
  value: OpacityValue;

  constructor(element: Partial<OpacityToken>) {
    super(element);
    this.value = element.value!;
  }
}
