import Token, { TokenInterface } from './Token';
import { ColorToken, ColorValue } from './Color';
import { TokensType } from './index';

export interface StepForGradient {
  type: string;
  color:
    | ColorToken
    | {
        value: ColorValue;
      };
  position: number;
}

interface Gradient {
  angle: string;
  colors: Array<StepForGradient>;
}

export interface GradientValue {
  gradients: Array<Gradient>;
}

export class GradientToken extends Token implements TokenInterface {
  type: TokensType = 'gradient';
  value: GradientValue;

  constructor(element: Partial<GradientToken>) {
    super(element);
    this.value = element.value!;
  }
}
