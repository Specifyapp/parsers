import Token, { TokenInterface } from './Token';
import { ColorValue } from './Color';
import { MeasurementValue } from './Measurement';
import { FontValue } from './Font';

export interface TextStyleValue {
  color: {
    value: ColorValue;
  };
  font: {
    value: FontValue;
  };
  size: {
    value: MeasurementValue;
  };
  lineHeight: {
    value: MeasurementValue;
  };
}

export class TextStyleToken extends Token implements TokenInterface {
  type: string;
  value: TextStyleValue;

  constructor(element: Partial<TextStyleToken>) {
    super(element);
    this.type = 'textStyle';
    this.value = element.value!;
  }
}
