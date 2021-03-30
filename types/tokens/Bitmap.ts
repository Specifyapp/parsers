import Token, { TokenInterface } from './Token';
import { TokensType } from './index';

export interface BitmapValue {
  url: string;
  format?: string;
  dimension?: number;
  fileName?: string;
}

export class BitmapToken extends Token implements TokenInterface {
  type: TokensType = 'bitmap';
  value: BitmapValue;

  constructor(element: Partial<BitmapToken>) {
    super(element);
    this.value = element.value!;
  }
}
