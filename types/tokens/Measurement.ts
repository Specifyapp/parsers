import Token, { TokenInterface } from './Token';

export interface MeasurementValue {
  measure: number;
  unit: string;
}

export class MeasurementToken extends Token implements TokenInterface {
  type: string;
  value: MeasurementValue;

  constructor(element: Partial<MeasurementToken>) {
    super(element);
    this.type = 'measurement';
    this.value = element.value!;
  }
}
