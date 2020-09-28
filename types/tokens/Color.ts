import Token, { TokenInterface } from './Token';

export interface ColorValue {
  r: number;
  g: number;
  b: number;
  a: number;
}

export class ColorToken extends Token implements TokenInterface {
  type: string;
  value: ColorValue;

  constructor(element: Partial<ColorToken>) {
    super(element);
    this.type = 'color';
    this.value = element.value!;
  }
}
