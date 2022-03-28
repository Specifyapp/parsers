import Token from './Token';
import { DurationValue, TokensType } from './index';

export class DurationToken extends Token<DurationValue> {
  type: TokensType = 'duration';
  value: DurationValue;

  constructor(element: Partial<DurationToken>) {
    super(element);
    this.value = element.value!;
  }
}
