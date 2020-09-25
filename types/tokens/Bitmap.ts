import Token, { TokenInterface } from './Token';

export interface BitmapValue {
  url: string;
}

export class BitmapToken extends Token implements TokenInterface {
  value: BitmapValue;
  type: string;

  constructor(element: Partial<BitmapToken>) {
    super(element);
    this.type = 'bitmap';
    this.value = element.value!;
  }
}
