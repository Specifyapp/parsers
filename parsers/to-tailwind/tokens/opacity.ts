import { OpacityToken } from '../../../types';
import { Utils } from './index';
import { OpacityMapping } from '../to-tailwind.type';
import { OptionsType } from '../to-tailwind.parser';

export class Opacity extends OpacityToken {
  token: Partial<OpacityToken>;
  constructor(token: Partial<OpacityToken>, transformNameFn: Function) {
    super(token);
    this.token = { ...token, name: transformNameFn(token.name) };
  }

  generate(options: OptionsType): OpacityMapping {
    const keyName = Utils.getTemplatedTokenName(this.token, options?.renameKeys?.opacity);
    return {
      opacity: {
        [keyName]: `${this.value.opacity / 100}`,
      },
    };
  }

  static afterGenerate(tokens: OpacityMapping) {
    if (tokens.opacity) tokens.opacity = Utils.sortObject(tokens.opacity);
    return tokens;
  }
}
