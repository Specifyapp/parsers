import Token, { TokenInterface } from './Token';

export interface VectorValue {
  url: string;
}

export class VectorToken extends Token implements TokenInterface {
  type: string;
  value: VectorValue;

  constructor(element: Partial<VectorToken>) {
    super(element);
    this.type = 'vector';
    this.value = element.value!;
  }
}
