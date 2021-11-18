import { DepthToken } from '../../../types';
import { OptionsType } from '../to-tailwind.parser';
import { DepthMapping, TailwindMappingTypes } from '../to-tailwind.type';
import { Utils } from './index';

export class Depth extends DepthToken {
  token: Partial<DepthToken>;
  constructor(token: Partial<DepthToken>, transformNameFn: Function) {
    super(token);
    this.token = { ...token, name: transformNameFn(token.name) };
  }

  generate(options: OptionsType): DepthMapping {
    const keyName = Utils.getTemplatedTokenName(this.token, options?.renameKeys?.zIndex);
    return {
      zIndex: {
        [keyName]: `${this.value.depth}`,
      },
    };
  }

  static afterGenerate(tokens: TailwindMappingTypes) {
    if (tokens.zIndex) tokens.zIndex = Utils.sortObject(tokens.zIndex);
    return tokens;
  }
}
