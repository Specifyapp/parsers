import { DepthToken } from '../../../types';
import { OptionsType } from '../to-tailwind.parser';
import { DepthMapping, TailwindMappingTypes } from '../to-tailwind.type';
import { Utils } from './index';

export class Depth extends DepthToken {
  token: Partial<DepthToken>;
  constructor(token: Partial<DepthToken>) {
    super(token);
    this.token = token;
  }

  generate(options: OptionsType): DepthMapping {
    return {
      zIndex: Utils.go<ConstructorParameters<typeof DepthToken>[0]>(
        this.token,
        options,
        'zIndex',
        `${this.value.depth}`,
      ),
    };
  }

  static afterGenerate(tokens: TailwindMappingTypes) {
    if (tokens.zIndex) tokens.zIndex = Utils.sortObjectByValue(tokens.zIndex);
    return tokens;
  }
}
