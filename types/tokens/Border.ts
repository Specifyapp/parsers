import Token, { TokenInterface } from './Token';
import { ColorValue } from './Color';
import { MeasurementValue } from './Measurement';

export interface BorderValue {
  color: {
    value: ColorValue;
  };
  type: string;
  width: {
    value: MeasurementValue;
  };
}

export class BorderToken extends Token implements TokenInterface {
  type: string;
  value: BorderValue;

  constructor(element: Partial<BorderToken>) {
    super(element);
    this.type = 'border';
    this.value = element.value!;
  }
}
