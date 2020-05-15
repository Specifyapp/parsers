import { DurationToken } from '@specifyapp/types';

export class Duration extends DurationToken {
  constructor() {
    super();
  }

  toCss() {
    const { duration, unit } = this.value;
    return `${duration}${unit}`;
  }
}
