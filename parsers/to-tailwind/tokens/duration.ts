import { DurationToken } from '../../../types';
import { Utils } from './index';
import { DurationMapping, TailwindMappingTypes } from '../to-tailwind.type';

export class Duration extends DurationToken {
  transformedName: string;
  constructor(token: Partial<DurationToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }
  generate(): DurationMapping {
    return {
      transitionDuration: {
        [this.transformedName]: `${this.value.duration}${this.value.unit}`,
      },
    };
  }

  static afterGenerate(tokens: TailwindMappingTypes) {
    if (tokens.transitionDuration)
      tokens.transitionDuration = Utils.sortObject(tokens.transitionDuration);
    return tokens;
  }
}
