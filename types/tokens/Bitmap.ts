import Token, { TokenInterface } from './Token';

export interface BitmapValue {
  url: string;
  format?: string;
  dimension?: string;
  fileName?: string;
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
