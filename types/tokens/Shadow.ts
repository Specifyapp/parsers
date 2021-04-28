import Token, { TokenInterface } from './Token';
import { ColorToken, ColorValue } from './Color';
import { MeasurementToken, MeasurementValue } from './Measurement';
import { TokensType } from './index';

export interface Shadow {
  color:
    | {
        value: ColorValue;
      }
    | ColorToken;
  offsetX:
    | {
        value: MeasurementValue;
      }
    | MeasurementToken;
  offsetY:
    | {
        value: MeasurementValue;
      }
    | MeasurementToken;
  blur:
    | {
        value: MeasurementValue;
      }
    | MeasurementToken;
  spread?:
    | {
        value: MeasurementValue;
      }
    | MeasurementToken;

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
