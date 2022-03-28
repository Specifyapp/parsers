import { MeasurementToken } from '../../../types/tokens/Measurement';
import { FormatTokenType } from '../to-jss.parser';

export class Measurement extends MeasurementToken {
  constructor(token: Partial<MeasurementToken>) {
    super(token);
  }
  toJss({ measurementFormat = 'string' }: FormatTokenType) {
    return measurementFormat === 'number'
      ? this.value.measure
      : `'${this.value.measure}${this.value.unit}'`;
  }
}
