import { MeasurementToken } from '../../../types';

export class Measurement extends MeasurementToken {
  constructor(token: Partial<MeasurementToken>) {
    super(token);
  }
  toScss(): string {
    return `${this.value.measure}${this.value.unit}`;
  }
}
