import { DurationToken } from '../../../types/tokens/Duration';

export class Duration extends DurationToken {
  constructor(token: Partial<DurationToken>) {
    super(token);
  }

  toReactNative() {
    const { duration, unit } = this.value;
    switch (unit) {
      case 'h':
        return duration * 60 * 60 * 1000;
      case 'm':
        return duration * 60 * 1000;
      case 's':
        return duration * 1000;
      case 'ms':
      default:
        return duration;
      case 'ns':
        return duration / 1000;
    }
  }
}
