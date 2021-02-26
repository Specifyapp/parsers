import Token, { TokenInterface } from './Token';
import { ColorValue } from './Color';

export interface ColorForGradient {
  value: ColorValue;
  type: string;
  position: number;
}

interface Gradient {
  angle: string;
  colors: Array<ColorForGradient>;
}

export interface GradientValue {
  gradients: Array<Gradient>;
}

export class GradientToken extends Token implements TokenInterface {
  type: string;
  value: GradientValue;

  constructor(element: Partial<GradientToken>) {
    super(element);
    this.type = 'gradient';
    this.value = element.value!;
  }
}
