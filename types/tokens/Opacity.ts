import Token, { TokenInterface } from './Token';

export interface OpacityValue {
  opacity: number;
}

export class OpacityToken extends Token implements TokenInterface {
  type: string;
  value: OpacityValue;

  constructor(element: Partial<OpacityToken>) {
    super(element);
    this.type = 'opacity';
    this.value = element.value!;
  }
}
