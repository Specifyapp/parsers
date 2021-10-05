import { MeasurementToken } from '../../../types';

export class Measurement extends MeasurementToken {
  constructor(token: Partial<MeasurementToken>) {
    super(token);
  }
  toReactNative() {
    return this.value.measure;
  }
}
