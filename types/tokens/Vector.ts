import Token, { TokenInterface } from './Token';
import { TokensType } from './index';

export interface VectorValue {
  url?: string;
  content?: string;
  format?: string;
  fileName?: string;
}

export class VectorToken extends Token implements TokenInterface {
  type: TokensType = 'vector';
  value: VectorValue;

  constructor(element: Partial<VectorToken>) {
    super(element);
    this.value = element.value!;
  }
}
