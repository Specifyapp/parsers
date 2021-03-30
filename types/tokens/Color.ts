import Token, { TokenInterface } from './Token';
import { TokensType } from './index';

export interface ColorValue {
  r: number;
  g: number;
  b: number;
  a: number;
}

export class ColorToken extends Token implements TokenInterface {
  type: TokensType = 'color';
  value: ColorValue;

  constructor(element: Partial<ColorToken>) {
    super(element);
    this.value = element.value!;
  }
}
