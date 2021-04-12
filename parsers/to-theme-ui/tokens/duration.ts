import { DurationToken } from '../../../types';
import { Utils } from './index';
import { DurationMapping } from '../to-theme-ui.type';

interface ThemeUiDuration extends Partial<Record<DurationMapping, any>> {
  durations: Record<string, number | string>;
}

export class Duration extends DurationToken {
  transformedName: string;
  constructor(token: Partial<DurationToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }
  generate(): ThemeUiDuration {
    return {
      durations: {
        [this.transformedName]: `${this.value.duration}${this.value.unit}`,
      },
    };
  }

  static afterGenerate(tokens: ThemeUiDuration) {
    tokens.durations = Utils.sortObject(tokens.durations);
    return tokens;
  }
}
