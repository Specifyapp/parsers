import { DurationToken } from '../../../types';
import { FormatTokenType } from '../to-jss.parser';

export class Duration extends DurationToken {
  constructor(token: Partial<DurationToken>) {
    super(token);
  }

  toJss({ durationFormat = 'string' }: FormatTokenType) {
    const { duration, unit } = this.value;
    return durationFormat === 'number' ? duration : `'${duration}${unit}'`;
  }
}
