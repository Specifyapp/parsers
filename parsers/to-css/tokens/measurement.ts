import { MeasurementToken } from '@specifyapp/types';

export class Measurement extends MeasurementToken {
  constructor() {
    super();
  }
  toCss(): string {
    return `${this.value.measure}${this.value.unit}`;
  }
}
