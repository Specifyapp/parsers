import Token from './Token';
import { MeasurementValue, TokensType } from './index';

export class MeasurementToken extends Token<MeasurementValue> {
  type: TokensType = 'measurement';
  value: MeasurementValue;

  constructor(element: Partial<MeasurementToken>) {
    super(element);
    this.value = element.value!;
  }
}
