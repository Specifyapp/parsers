import Token, { TokenInterface } from './Token';
import { TokensType } from './index';

export interface DepthValue {
  depth: number;
}

export class DepthToken extends Token implements TokenInterface {
  type: TokensType = 'depth';
  value: DepthValue;

  constructor(element: Partial<DepthToken>) {
    super(element);
    this.value = element.value!;
  }
}
