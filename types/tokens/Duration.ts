import Token, { TokenInterface } from './Token';
import { TokensType } from './index';

export interface DurationValue {
  duration: number;
  unit: string;
}

export class DurationToken extends Token implements TokenInterface {
  type: TokensType = 'duration';
  value: DurationValue;

  constructor(element: Partial<DurationToken>) {
    super(element);
    this.value = element.value!;
  }
}
