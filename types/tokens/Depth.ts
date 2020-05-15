import Token, { TokenInterface } from './Token';

export interface DepthValue {
  depth: number;
}

export class DepthToken extends Token implements TokenInterface {
  type: string;
  value: DepthValue;

  constructor(element: Partial<DepthToken>) {
    super(element);
    this.type = 'depth';
    this.value = element.value!;
  }
}
