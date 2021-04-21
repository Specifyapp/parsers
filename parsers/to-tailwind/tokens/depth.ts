import { DepthToken } from '../../../types';
import { DepthMapping, TailwindMappingTypes } from '../to-tailwind.type';
import { Utils } from './index';

export class Depth extends DepthToken {
  transformedName: string;
  constructor(token: Partial<DepthToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }

  generate(): DepthMapping {
    return {
      zIndex: {
        [this.transformedName]: `${this.value.depth}`,
      },
    };
  }

  static afterGenerate(tokens: TailwindMappingTypes) {
    if (tokens.zIndex) tokens.zIndex = Utils.sortObject(tokens.zIndex);
    return tokens;
  }
}
