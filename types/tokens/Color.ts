import Token from './Token';
import { ColorValue, TokensType } from './index';

export class ColorToken extends Token<ColorValue> {
  type: TokensType = 'color';
  value: ColorValue;

  constructor(element: Partial<ColorToken>) {
    super(element);
    this.value = element.value!;
  }
}
