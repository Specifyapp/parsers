import Token, { TokenInterface } from './Token';
import { ColorValue } from './Color';
import { MeasurementValue } from './Measurement';
import { TokensType } from './index';

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
  spread?: {
    value: MeasurementValue;
  };
  isInner: boolean;
}

export type ShadowValue = Array<Shadow>;

export class ShadowToken extends Token implements TokenInterface {
  type: TokensType = 'shadow';
  value: ShadowValue;

  constructor(element: Partial<ShadowToken>) {
    super(element);
    this.value = element.value!;
  }
}
