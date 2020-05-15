import Token, { TokenInterface } from './Token';

export interface DurationValue {
  duration: number;
  unit: string;
}

export class DurationToken extends Token implements TokenInterface {
  type: string;
  value: DurationValue;

  constructor(element: Partial<DurationToken>) {
    super(element);
    this.type = 'duration';
    this.value = element.value!;
  }
}
