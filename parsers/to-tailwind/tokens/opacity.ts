import { OpacityToken } from '../../../types';
import { Utils } from './index';
import { OpacityMapping } from '../to-tailwind.type';
import { OptionsType } from '../to-tailwind.parser';

export class Opacity extends OpacityToken {
  token: Partial<OpacityToken>;
  constructor(token: Partial<OpacityToken>) {
    super(token);
    this.token = token;
  }

  generate(options: OptionsType): OpacityMapping {
    return {
      opacity: Utils.go<ConstructorParameters<typeof OpacityToken>[0]>(
        this.token,
        options,
        'opacity',
        `${this.value.opacity / 100}`,
      ),
    };
  }

  static afterGenerate(tokens: OpacityMapping) {
    if (tokens.opacity) tokens.opacity = Utils.sortObjectByValue(tokens.opacity);
    return tokens;
  }
}
