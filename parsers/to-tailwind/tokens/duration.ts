import { DurationToken } from '../../../types';
import { Utils } from './index';
import { DurationMapping, TailwindMappingTypes } from '../to-tailwind.type';
import { OptionsType } from '../to-tailwind.parser';

export class Duration extends DurationToken {
  token: Partial<DurationToken>;
  constructor(token: Partial<DurationToken>) {
    super(token);
    this.token = token;
  }
  generate(options: OptionsType): DurationMapping {
    return {
      transitionDuration: Utils.go<ConstructorParameters<typeof DurationToken>[0]>(
        this.token,
        options,
        'transitionDuration',
        `${this.value.duration}${this.value.unit}`,
      ),
    };
  }

  static afterGenerate(tokens: TailwindMappingTypes) {
    if (tokens.transitionDuration)
      tokens.transitionDuration = Utils.sortObjectByValue(tokens.transitionDuration);
    return tokens;
  }
}
