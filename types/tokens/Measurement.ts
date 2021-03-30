import Token, { TokenInterface } from './Token';
import { TokensType } from './index';

export interface MeasurementValue {
  measure: number;
  unit: string;
}

export class MeasurementToken extends Token implements TokenInterface {
  type: TokensType = 'measurement';
  value: MeasurementValue;

  constructor(element: Partial<MeasurementToken>) {
    super(element);
    this.value = element.value!;
  }
}
