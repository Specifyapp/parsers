import { OpacityToken } from '../../../types';
import { Utils } from './index';
import { OpacityMapping } from '../to-tailwind.type';

export class Opacity extends OpacityToken {
  transformedName: string;

  constructor(token: Partial<OpacityToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }

  generate(): OpacityMapping {
    return {
      opacity: {
        [this.transformedName]: `${this.value.opacity / 100}`,
      },
    };
  }

  static afterGenerate(tokens: OpacityMapping) {
    if (tokens.opacity) tokens.opacity = Utils.sortObject(tokens.opacity);
    return tokens;
  }
}
