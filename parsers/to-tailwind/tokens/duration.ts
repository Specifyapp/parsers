import { DurationToken } from '../../../types';
import { Utils } from './index';
import { DurationMapping, TailwindMappingTypes } from '../to-tailwind.type';
import { OptionsType } from '../to-tailwind.parser';

export class Duration extends DurationToken {
  token: Partial<DurationToken>;
  constructor(token: Partial<DurationToken>, transformNameFn: Function) {
    super(token);
    this.token = { ...token, name: transformNameFn(token.name) };
  }
  generate(options: OptionsType): DurationMapping {
    const keyName = Utils.getTemplatedTokenName(
      this.token,
      options?.renameKeys?.transitionDuration,
    );
    return {
      transitionDuration: {
        [keyName]: `${this.value.duration}${this.value.unit}`,
      },
    };
  }

  static afterGenerate(tokens: TailwindMappingTypes) {
    if (tokens.transitionDuration)
      tokens.transitionDuration = Utils.sortObject(tokens.transitionDuration);
    return tokens;
  }
}
