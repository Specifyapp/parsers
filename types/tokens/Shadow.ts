import Token, { TokenInterface } from './Token';
import { ColorValue } from './Color';
import { MeasurementValue } from './Measurement';

export interface Shadow {
  color: {
    value: ColorValue;
  };
  offsetX: {
    value: MeasurementValue;
  };
  offsetY: {
    value: MeasurementValue;
  };
  blur: {
    value: MeasurementValue;
  };
  isInner: boolean;
}

export type ShadowValue = Array<Shadow>;

export class ShadowToken extends Token implements TokenInterface {
  type: string;
  value: ShadowValue;

  constructor(element: Partial<ShadowToken>) {
    super(element);
    this.type = 'shadow';
    this.value = element.value!;
  }
}
