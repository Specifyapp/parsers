import { DurationToken } from '@specifyapp/types';

export class Duration extends DurationToken {
  constructor(token: Partial<DurationToken>) {
    super(token);
  }

  toCss() {
    const { duration, unit } = this.value;
    return `${duration}${unit}`;
  }
}
